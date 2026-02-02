import { buildingInfo } from '@/constant/buildingInfo'
import { placeRoad } from '@/utils/placement'

export const useConstructionStore = defineStore('construction', () => {
  const { players } = storeToRefs(usePlayersStore())
  const { map } = storeToRefs(useMapStore())
  const { jobs } = storeToRefs(useJobStore())

  const constructionSites = ref<ConstructionSite[]>([])

  // Work rate: progress per second when builder is working
  const WORK_RATE = 20 // 20% per second = 5 seconds to complete with all materials

  // Throttle updates
  let lastUpdate = 0
  const UPDATE_INTERVAL = 1000 // 1 second

  /**
   * Generate a unique construction site ID
   */
  const generateSiteId = (): ConstructionSiteId => {
    return `construction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Find an adjacent road tile for a position (for roads/fields/vines)
   */
  const findAdjacentRoad = (x: number, y: number): Vector2D | null => {
    const offsets = [
      { dx: 0, dy: 1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 }
    ]

    for (const offset of offsets) {
      const roadX = x + offset.dx
      const roadY = y + offset.dy

      if (
        roadY >= 0 &&
        roadY < map.value.length &&
        roadX >= 0 &&
        roadX < map.value[0].length &&
        map.value[roadY][roadX].isRoad
      ) {
        return { x: roadX, y: roadY }
      }
    }

    return null
  }

  /**
   * Get entry point for a construction site
   * For buildings: use the building's entry point (road auto-created at door)
   * For roads/fields/vines: find adjacent road tile
   */
  const getConstructionEntryPoint = (site: ConstructionSite): Vector2D | null => {
    if (site.type === 'building' && site.buildingId) {
      // For buildings, the road is auto-created at the entry point
      // Find the building and get its entry point
      const player = players.value[0]
      const building = player.buildings.find((b) => b.id === site.buildingId)
      if (building) {
        const info = buildingInfo[building.type]
        const pattern = info.pattern

        // Find the "2" in the pattern
        let entryRelX = 0
        let entryRelY = 0
        for (let y = 0; y < pattern.length; y++) {
          for (let x = 0; x < pattern[y].length; x++) {
            if (pattern[y][x] === 2) {
              entryRelX = x
              entryRelY = y
              break
            }
          }
        }

        // The road is placed at this position during building placement
        const roadX = building.x + entryRelX
        const roadY = building.y + entryRelY

        if (map[roadY]?.[roadX]?.isRoad) {
          return { x: roadX, y: roadY }
        }
      }
    }

    // For roads/fields/vines, find adjacent road
    return findAdjacentRoad(site.x, site.y)
  }

  /**
   * Create a new construction site
   */
  const createConstructionSite = (params: {
    type: ConstructionType
    x: number
    y: number
    buildingType?: Building
    buildingId?: BuildingId
  }): ConstructionSite | null => {
    const { type, x, y, buildingType, buildingId } = params

    // Calculate required resources
    let requiredResources: Partial<Record<Resource, number>> = {}

    if (type === 'road') {
      requiredResources = { stone: 1 }
    } else if (type === 'field') {
      requiredResources = {} // No materials needed
    } else if (type === 'vines') {
      requiredResources = { wood: 1 }
    } else if (type === 'building' && buildingType) {
      const info = buildingInfo[buildingType]
      if (info.stone > 0) requiredResources.stone = info.stone
      if (info.wood > 0) requiredResources.wood = info.wood
    }

    const site: ConstructionSite = {
      id: generateSiteId(),
      type,
      x,
      y,
      buildingType,
      buildingId,
      requiredResources,
      deliveredResources: {},
      status: 'planned',
      progress: 0,
      entryPoint: undefined
    }

    // For buildings, entry point will be available after road is placed
    // For roads/fields/vines, we need an adjacent road
    if (type !== 'building') {
      const entryPoint = findAdjacentRoad(x, y)
      if (!entryPoint) {
        console.warn('Cannot create construction site: no adjacent road')
        return null
      }
      site.entryPoint = entryPoint
    }

    constructionSites.value.push(site)
    return site
  }

  /**
   * Check if a construction job already exists for a site
   */
  const hasConstructionJob = (siteId: ConstructionSiteId): boolean => {
    return jobs.value.some((j) => j.constructionSiteId === siteId && j.type === 'construction')
  }

  /**
   * Create a construction job for a site
   * The job store will handle finding and assigning an idle builder
   */
  const assignBuilder = (site: ConstructionSite): boolean => {
    // Don't create job if one already exists
    if (hasConstructionJob(site.id)) return false

    // Check if there's at least one builder available (job store will actually assign)
    const player = players.value[0]
    const hasIdleBuilder = player.characters.some((c) => c.type === 'builder' && c.state === 'idle')
    if (!hasIdleBuilder) return false

    // Get entry point
    let entryPoint = site.entryPoint
    if (!entryPoint && site.type === 'building') {
      entryPoint = getConstructionEntryPoint(site)
      if (entryPoint) {
        site.entryPoint = entryPoint
      }
    }

    if (!entryPoint) {
      console.warn('Cannot assign builder: no entry point for site')
      return false
    }

    // Update status - builder will be assigned by job store
    site.status = 'waiting-builder'

    // Create construction job - job store will find and assign the builder
    const job: Job = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'ready',
      type: 'construction',
      character: 'builder',
      description: `Build ${site.type}${site.buildingType ? ` (${site.buildingType})` : ''}`,
      x1: entryPoint.x,
      y1: entryPoint.y,
      x2: entryPoint.x,
      y2: entryPoint.y,
      constructionSiteId: site.id
    }

    jobs.value.push(job)
    return true
  }

  /**
   * Called when builder arrives at construction site
   */
  const onBuilderArrived = (siteId: ConstructionSiteId, builderId: CharacterId): void => {
    const site = constructionSites.value.find((s) => s.id === siteId)
    if (!site) return

    site.assignedBuilderId = builderId
    site.status = 'in-progress'
  }

  /**
   * Handle resource delivery to construction site
   */
  const deliverResource = (siteId: ConstructionSiteId, resource: Resource, amount: number): void => {
    const site = constructionSites.value.find((s) => s.id === siteId)
    if (!site) return

    site.deliveredResources[resource] = (site.deliveredResources[resource] || 0) + amount
  }

  /**
   * Calculate maximum progress based on delivered materials
   */
  const calculateMaxProgress = (site: ConstructionSite): number => {
    const requiredTotal = Object.values(site.requiredResources).reduce((a, b) => a + (b || 0), 0)

    // If no resources required, can complete immediately
    if (requiredTotal === 0) return 100

    const deliveredTotal = Object.values(site.deliveredResources).reduce((a, b) => a + (b || 0), 0)
    return Math.min(100, (deliveredTotal / requiredTotal) * 100)
  }

  /**
   * Process construction work for a site
   */
  const processConstruction = (site: ConstructionSite, deltaTime: number): void => {
    if (site.status !== 'in-progress') return
    if (!site.assignedBuilderId) return

    const maxProgress = calculateMaxProgress(site)

    // Builder can only work up to the max progress based on materials
    if (site.progress < maxProgress) {
      const workDone = (WORK_RATE * deltaTime) / 1000
      site.progress = Math.min(site.progress + workDone, maxProgress)
    }

    // Check if complete
    if (site.progress >= 100) {
      completeConstruction(site)
    }
  }

  /**
   * Complete construction and create the actual item
   */
  const completeConstruction = (site: ConstructionSite): void => {
    const player = players.value[0]

    if (site.type === 'building' && site.buildingId) {
      // Mark building as complete
      const building = player.buildings.find((b) => b.id === site.buildingId)
      if (building) {
        building.construction = undefined // undefined = complete
      }
    } else if (site.type === 'road') {
      // Place the road
      placeRoad({ map: map.value, x: site.x, y: site.y })
      usePlayersStore().addRoad({ x: site.x, y: site.y, id: uid('road-') as RoadId })
    } else if (site.type === 'field') {
      usePlayersStore().addField({ x: site.x, y: site.y })
    } else if (site.type === 'vines') {
      usePlayersStore().addVines({ x: site.x, y: site.y })
    }

    // Release builder
    if (site.assignedBuilderId) {
      const builder = player.characters.find((c) => c.id === site.assignedBuilderId)
      if (builder) {
        builder.state = 'idle'
      }
    }

    // Remove construction job
    const jobIndex = jobs.value.findIndex((j) => j.constructionSiteId === site.id)
    if (jobIndex > -1) {
      jobs.value.splice(jobIndex, 1)
    }

    // Remove site
    const siteIndex = constructionSites.value.findIndex((s) => s.id === site.id)
    if (siteIndex > -1) {
      constructionSites.value.splice(siteIndex, 1)
    }
  }

  /**
   * Get a construction site by ID
   */
  const getSiteById = (siteId: ConstructionSiteId): ConstructionSite | undefined => {
    return constructionSites.value.find((s) => s.id === siteId)
  }

  /**
   * Main update function
   */
  const update = (): void => {
    const now = Date.now()
    const deltaTime = lastUpdate ? now - lastUpdate : UPDATE_INTERVAL
    if (deltaTime < UPDATE_INTERVAL) return
    lastUpdate = now

    for (const site of constructionSites.value) {
      // Assign builders to planned sites
      if (site.status === 'planned') {
        assignBuilder(site)
      }

      // Process in-progress sites
      if (site.status === 'in-progress') {
        processConstruction(site, deltaTime)
      }
    }
  }

  return {
    constructionSites,
    createConstructionSite,
    getConstructionEntryPoint,
    onBuilderArrived,
    deliverResource,
    processConstruction,
    completeConstruction,
    getSiteById,
    update
  }
})
