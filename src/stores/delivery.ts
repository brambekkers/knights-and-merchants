import { buildingInfo } from '@/constant/buildingInfo'
import { getBuildingEntryPoint } from '@/utils/buildingEntry'

type DeliveryRequest = {
  buildingId: BuildingId
  resource: Resource
  amount: number
  type: 'need' | 'offer'
  priority: number
  // Construction site delivery fields
  constructionSiteId?: ConstructionSiteId
  isConstruction?: boolean
}

export const useDeliveryStore = defineStore('delivery', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { map } = useMapStore()
  const { jobs } = storeToRefs(useJobStore())

  // Cache of building entry points
  const entryPointCache = ref<Map<BuildingId, Vector2D>>(new Map())

  // Pending delivery requests
  const requests = ref<DeliveryRequest[]>([])

  // Throttle updates
  let lastUpdate = 0
  const UPDATE_INTERVAL = 1000 // 1 second

  /**
   * Get or calculate entry point for a building
   */
  const getEntryPoint = (building: PlayerBuilding): Vector2D | null => {
    const cached = entryPointCache.value.get(building.id)
    if (cached) return cached

    const entryPoint = getBuildingEntryPoint(building, map)
    if (entryPoint) {
      entryPointCache.value.set(building.id, entryPoint)
    }
    return entryPoint
  }

  /**
   * Scan all buildings for resource needs and offers
   */
  const scanBuildingNeeds = () => {
    const newRequests: DeliveryRequest[] = []
    const player = players.value[0]

    for (const building of player.buildings) {
      const info = buildingInfo[building.type]

      // Skip storehouse for needs (it's a sink, not a consumer)
      if (building.type === 'storehouse') {
        continue
      }

      // Skip buildings under construction (they don't produce yet)
      if (building.construction !== undefined) {
        continue
      }

      // Check for OUTPUT resources that need to be collected
      if (info.generate?.output) {
        for (const resource of Object.keys(info.generate.output) as Resource[]) {
          const currentStock = building.stock[resource] || 0
          const maxStock = info.maxStock[resource] || 0

          // If there's stock available, offer it for collection
          if (currentStock > 0) {
            newRequests.push({
              buildingId: building.id,
              resource,
              amount: currentStock,
              type: 'offer',
              priority: calculateOfferPriority(currentStock, maxStock)
            })
          }
        }
      }

      // Check for INPUT resources that are needed
      if (info.generate?.input) {
        for (const resource of Object.keys(info.generate.input) as Resource[]) {
          const currentStock = building.stock[resource] || 0
          const maxInputBuffer = info.maxStock[resource] || 4

          // If below max input buffer, request delivery
          if (currentStock < maxInputBuffer) {
            newRequests.push({
              buildingId: building.id,
              resource,
              amount: maxInputBuffer - currentStock,
              type: 'need',
              priority: calculateNeedPriority(building.type, currentStock)
            })
          }
        }
      }
    }

    // Scan construction sites for material needs
    const { constructionSites } = storeToRefs(useConstructionStore())

    for (const site of constructionSites.value) {
      // Only sites that have a builder assigned need materials delivered
      if (site.status !== 'in-progress' && site.status !== 'waiting-builder') continue

      // Skip sites with no required resources (like fields)
      if (Object.keys(site.requiredResources).length === 0) continue

      // Check what materials are still needed
      for (const [resource, required] of Object.entries(site.requiredResources)) {
        const delivered = site.deliveredResources[resource as Resource] || 0
        const needed = (required as number) - delivered

        if (needed > 0 && site.entryPoint) {
          newRequests.push({
            buildingId: site.id as unknown as BuildingId, // Reuse field for lookup
            constructionSiteId: site.id,
            isConstruction: true,
            resource: resource as Resource,
            amount: needed,
            type: 'need',
            priority: 90 // High priority for construction
          })
        }
      }
    }

    requests.value = newRequests
  }

  /**
   * Calculate priority for resource offers (higher = more urgent)
   */
  const calculateOfferPriority = (currentStock: number, maxStock: number): number => {
    let priority = 30

    // Higher priority if building is full (blocking production)
    if (currentStock >= maxStock) {
      priority += 40
    } else if (currentStock >= maxStock * 0.8) {
      priority += 20
    }

    return priority
  }

  /**
   * Calculate priority for resource needs (higher = more urgent)
   */
  const calculateNeedPriority = (buildingType: Building, currentStock: number): number => {
    let priority = 50

    // Higher priority if stock is empty (production halted)
    if (currentStock === 0) {
      priority += 30
    }

    // Higher priority for food production chain
    if (['bakery', 'inn', 'butcher', 'mill'].includes(buildingType)) {
      priority += 20
    }

    return priority
  }

  /**
   * Find a building that has the requested resource available
   */
  const findResourceSource = (
    resource: Resource,
    destBuildingId: BuildingId
  ): PlayerBuilding | null => {
    const player = players.value[0]

    // First, look for production buildings offering this resource
    const offers = requests.value.filter(
      r => r.type === 'offer' && r.resource === resource && r.buildingId !== destBuildingId
    )

    if (offers.length > 0) {
      // Sort by priority (highest first)
      offers.sort((a, b) => b.priority - a.priority)
      const bestOffer = offers[0]
      return player.buildings.find(b => b.id === bestOffer.buildingId) || null
    }

    // Fallback: check storehouse
    const storehouse = player.buildings.find(b => b.type === 'storehouse')
    if (storehouse && (storehouse.stock[resource] || 0) > 0) {
      return storehouse
    }

    return null
  }

  /**
   * Find the storehouse building
   */
  const findStorehouse = (): PlayerBuilding | null => {
    const player = players.value[0]
    return player.buildings.find(b => b.type === 'storehouse') || null
  }

  /**
   * Check if a delivery job already exists for this route
   */
  const jobExistsFor = (
    sourceBuildingId: BuildingId,
    destBuildingId: BuildingId,
    resource: Resource
  ): boolean => {
    return jobs.value.some(
      (j: Job) =>
        j.sourceBuildingId === sourceBuildingId &&
        j.destBuildingId === destBuildingId &&
        j.resource === resource &&
        j.status !== 'delivering' // Allow new jobs once delivery phase starts
    )
  }

  /**
   * Create a delivery job between two buildings or to a construction site
   */
  const createDeliveryJob = (
    sourceBuilding: PlayerBuilding,
    destBuilding: PlayerBuilding | null,
    resource: Resource,
    amount: number = 1,
    constructionSiteId?: ConstructionSiteId
  ): Job | null => {
    const sourceEntry = getEntryPoint(sourceBuilding)

    let destEntry: Vector2D | null = null
    let description = ''

    if (constructionSiteId) {
      // Delivering to a construction site
      const site = useConstructionStore().getSiteById(constructionSiteId)
      if (!site || !site.entryPoint) {
        console.warn('Cannot create delivery job: construction site not connected to road network')
        return null
      }
      destEntry = site.entryPoint
      description = `Deliver ${resource} to construction site`
    } else if (destBuilding) {
      // Delivering to a building
      destEntry = getEntryPoint(destBuilding)
      description = `Deliver ${resource} from ${sourceBuilding.type} to ${destBuilding.type}`
    }

    if (!sourceEntry || !destEntry) {
      console.warn('Cannot create delivery job: not connected to road network')
      return null
    }

    const job: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'ready',
      type: constructionSiteId ? 'construction-delivery' : 'delivery',
      character: 'servant',
      description,
      x1: sourceEntry.x,
      y1: sourceEntry.y,
      x2: destEntry.x,
      y2: destEntry.y,
      sourceBuildingId: sourceBuilding.id,
      destBuildingId: destBuilding?.id,
      constructionSiteId,
      resource,
      amount
    }

    jobs.value.push(job)
    return job
  }

  /**
   * Check if any building needs this resource (has room for it)
   */
  const hasConsumerForResource = (resource: Resource, excludeBuildingId?: BuildingId): boolean => {
    return requests.value.some(
      r => r.type === 'need' && r.resource === resource && r.buildingId !== excludeBuildingId
    )
  }

  /**
   * Count how many units of a resource are needed by all buildings
   */
  const getTotalDemand = (resource: Resource): number => {
    return requests.value
      .filter(r => r.type === 'need' && r.resource === resource)
      .reduce((sum, r) => sum + r.amount, 0)
  }

  /**
   * Count how many jobs are already delivering this resource (not yet picked up)
   */
  const getPendingDeliveries = (resource: Resource): number => {
    return jobs.value.filter(
      (j: Job) => j.resource === resource && j.status !== 'delivering'
    ).length
  }

  /**
   * Check if a construction delivery job already exists
   */
  const constructionJobExistsFor = (
    sourceBuildingId: BuildingId,
    constructionSiteId: ConstructionSiteId,
    resource: Resource
  ): boolean => {
    return jobs.value.some(
      (j: Job) =>
        j.sourceBuildingId === sourceBuildingId &&
        j.constructionSiteId === constructionSiteId &&
        j.resource === resource &&
        j.status !== 'delivering'
    )
  }

  /**
   * Match resource offers to needs and create delivery jobs
   */
  const createDeliveryJobs = () => {
    const player = players.value[0]
    const needs = requests.value.filter(r => r.type === 'need')
    const offers = requests.value.filter(r => r.type === 'offer')

    // Separate construction needs from building needs
    const buildingNeeds = needs.filter(n => !n.isConstruction)
    const constructionNeeds = needs.filter(n => n.isConstruction)

    // Sort needs by priority (highest first)
    buildingNeeds.sort((a, b) => b.priority - a.priority)
    constructionNeeds.sort((a, b) => b.priority - a.priority)

    // Sort offers by priority (highest first - fullest buildings first)
    offers.sort((a, b) => b.priority - a.priority)

    const storehouse = findStorehouse()

    // Track how much demand remains for each resource
    const remainingDemand = new Map<Resource, number>()
    for (const need of needs) {
      const current = remainingDemand.get(need.resource) || 0
      remainingDemand.set(need.resource, current + need.amount)
    }

    // Subtract pending deliveries from demand
    for (const resource of remainingDemand.keys()) {
      const pending = getPendingDeliveries(resource)
      const current = remainingDemand.get(resource) || 0
      remainingDemand.set(resource, Math.max(0, current - pending))
    }

    // Track which offers have been fully handled
    const handledOffers = new Set<string>()

    // First pass: Match offers to building needs
    for (const need of buildingNeeds) {
      const destBuilding = player.buildings.find(b => b.id === need.buildingId)
      if (!destBuilding) continue

      // Find a source for this resource (excluding storehouse for now - prefer production buildings)
      const productionOffers = offers.filter(
        o => o.resource === need.resource &&
             o.buildingId !== need.buildingId &&
             !handledOffers.has(`${o.buildingId}-${o.resource}`)
      )

      for (const offer of productionOffers) {
        const sourceBuilding = player.buildings.find(b => b.id === offer.buildingId)
        if (!sourceBuilding) continue
        if (sourceBuilding.type === 'storehouse') continue // Handle storehouse separately

        // Check if job already exists
        if (jobExistsFor(sourceBuilding.id, destBuilding.id, need.resource)) {
          continue
        }

        // Create the delivery job
        createDeliveryJob(sourceBuilding, destBuilding, need.resource, 1)

        // Update remaining demand
        const demand = remainingDemand.get(need.resource) || 0
        remainingDemand.set(need.resource, Math.max(0, demand - 1))

        // Mark this specific delivery as handled (but offer may have more stock)
        break // Only create one job per need per cycle
      }
    }

    // Construction pass: Match offers to construction site needs
    for (const need of constructionNeeds) {
      if (!need.constructionSiteId) continue

      // Find a source for this resource
      const productionOffers = offers.filter(
        o => o.resource === need.resource &&
             !handledOffers.has(`${o.buildingId}-${o.resource}`)
      )

      for (const offer of productionOffers) {
        const sourceBuilding = player.buildings.find(b => b.id === offer.buildingId)
        if (!sourceBuilding) continue

        // Check if job already exists
        if (constructionJobExistsFor(sourceBuilding.id, need.constructionSiteId, need.resource)) {
          continue
        }

        // Create the delivery job to construction site
        createDeliveryJob(sourceBuilding, null, need.resource, 1, need.constructionSiteId)

        // Update remaining demand
        const demand = remainingDemand.get(need.resource) || 0
        remainingDemand.set(need.resource, Math.max(0, demand - 1))

        break // Only create one job per need per cycle
      }
    }

    // Second pass: Send excess/unneeded resources to storehouse
    if (storehouse) {
      for (const offer of offers) {
        const sourceBuilding = player.buildings.find(b => b.id === offer.buildingId)
        if (!sourceBuilding || sourceBuilding.id === storehouse.id) continue

        const demand = remainingDemand.get(offer.resource) || 0
        const hasConsumer = hasConsumerForResource(offer.resource, offer.buildingId)

        // Send to storehouse if:
        // 1. No building needs this resource (final product like bread with no inn demand)
        // 2. Supply exceeds demand (farm has corn but mill is full)
        // 3. Building is getting full and needs to offload
        const shouldSendToStorehouse = !hasConsumer || demand === 0 || offer.priority >= 50

        if (shouldSendToStorehouse) {
          if (!jobExistsFor(sourceBuilding.id, storehouse.id, offer.resource)) {
            createDeliveryJob(sourceBuilding, storehouse, offer.resource, 1)
          }
        }
      }

      // Third pass: If building needs exist but no production offers, check storehouse
      for (const need of buildingNeeds) {
        const destBuilding = player.buildings.find(b => b.id === need.buildingId)
        if (!destBuilding) continue

        // Skip if there's already a job delivering this resource to this building
        const hasIncomingDelivery = jobs.value.some(
          (j: Job) => j.destBuildingId === need.buildingId && j.resource === need.resource
        )
        if (hasIncomingDelivery) continue

        // Check if storehouse has this resource
        const storehouseStock = storehouse.stock[need.resource] || 0
        if (storehouseStock > 0) {
          if (!jobExistsFor(storehouse.id, destBuilding.id, need.resource)) {
            createDeliveryJob(storehouse, destBuilding, need.resource, 1)
          }
        }
      }

      // Fourth pass: If construction needs exist but no production offers, check storehouse
      for (const need of constructionNeeds) {
        if (!need.constructionSiteId) continue

        // Skip if there's already a job delivering this resource to this site
        const hasIncomingDelivery = jobs.value.some(
          (j: Job) => j.constructionSiteId === need.constructionSiteId && j.resource === need.resource
        )
        if (hasIncomingDelivery) continue

        // Check if storehouse has this resource
        const storehouseStock = storehouse.stock[need.resource] || 0
        if (storehouseStock > 0) {
          if (!constructionJobExistsFor(storehouse.id, need.constructionSiteId, need.resource)) {
            createDeliveryJob(storehouse, null, need.resource, 1, need.constructionSiteId)
          }
        }
      }
    }
  }

  /**
   * Main update function - called from game loop
   */
  const update = () => {
    const now = Date.now()
    if (now - lastUpdate < UPDATE_INTERVAL) return
    lastUpdate = now

    scanBuildingNeeds()
    createDeliveryJobs()
  }

  /**
   * Clear entry point cache (call when buildings are added/removed)
   */
  const clearCache = () => {
    entryPointCache.value.clear()
  }

  return {
    requests,
    entryPointCache,
    update,
    clearCache,
    getEntryPoint,
    scanBuildingNeeds,
    createDeliveryJobs
  }
})
