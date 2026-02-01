<script setup lang="ts">
  const { buildSelect } = storeToRefs(useSidebarStore())
</script>

<template>
  <div>
    <h3
      v-if="buildSelect !== 'delete'"
      class="title">
      Construct {{ buildSelect }}
    </h3>
    <h3
      v-else
      class="title">
      Remove
    </h3>
    <div id="build">
      <!-- 1 row -->
      <img
        class="item"
        src="/assets/building/icons/road.gif"
        style="grid-area: road"
        :class="{ selected: buildSelect === 'road' }"
        @click="buildSelect = 'road'" />
      <img
        class="item"
        src="/assets/building/icons/vines.gif"
        style="grid-area: vines"
        :class="{ selected: buildSelect === 'vines' }"
        @click="buildSelect = 'vines'" />
      <img
        class="item"
        src="/assets/building/icons/field.gif"
        style="grid-area: field"
        :class="{ selected: buildSelect === 'field' }"
        @click="buildSelect = 'field'" />
      <div
        class="item"
        style="grid-area: delete"
        :class="{ selected: buildSelect === 'delete' }"
        @click="buildSelect = 'delete'">
        <img
          src="/assets/ui/remove.png"
          style="width: 70%" />
      </div>
      <!-- 2 row -->
      <img
        class="item"
        src="/assets/building/icons/school.gif"
        style="grid-area: school"
        :class="{ selected: buildSelect === 'school' }"
        @click="buildSelect = 'school'" />
      <img
        class="item"
        src="/assets/building/icons/inn.gif"
        style="grid-area: inn"
        :class="{ selected: buildSelect === 'inn' }"
        @click="buildSelect = 'inn'" />
      <img
        class="item"
        src="/assets/building/icons/quarry.gif"
        style="grid-area: quarry"
        :class="{ selected: buildSelect === 'quarry' }"
        @click="buildSelect = 'quarry'" />
      <img
        class="item"
        src="/assets/building/icons/woodcutter.gif"
        style="grid-area: woodcutter"
        :class="{ selected: buildSelect === 'woodcutter' }"
        @click="buildSelect = 'woodcutter'" />
      <img
        class="item"
        src="/assets/building/icons/sawmill.gif"
        style="grid-area: sawmill"
        :class="{ selected: buildSelect === 'sawmill' }"
        @click="buildSelect = 'sawmill'" />
      <!-- 3 row -->
      <img
        class="item"
        src="/assets/building/icons/farm.gif"
        style="grid-area: farm"
        :class="{ selected: buildSelect === 'farm' }"
        @click="buildSelect = 'farm'" />
      <img
        class="item"
        src="/assets/building/icons/mill.gif"
        style="grid-area: mill"
        :class="{ selected: buildSelect === 'mill' }"
        @click="buildSelect = 'mill'" />
      <img
        class="item"
        src="/assets/building/icons/bakery.gif"
        style="grid-area: bakery"
        :class="{ selected: buildSelect === 'bakery' }"
        @click="buildSelect = 'bakery'" />
      <img
        class="item"
        src="/assets/building/icons/swinefarm.gif"
        style="grid-area: swinefarm"
        :class="{ selected: buildSelect === 'swinefarm' }"
        @click="buildSelect = 'swinefarm'" />
      <img
        class="item"
        src="/assets/building/icons/butcher.gif"
        style="grid-area: butcher"
        :class="{ selected: buildSelect === 'butcher' }"
        @click="buildSelect = 'butcher'" />
      <!-- 4 row -->

      <img
        class="item"
        src="/assets/building/icons/vineyard.gif"
        style="grid-area: vineyard"
        :class="{ selected: buildSelect === 'vineyard' }"
        @click="buildSelect = 'vineyard'" />
      <img
        class="item"
        src="/assets/building/icons/goldmine.gif"
        style="grid-area: goldmine"
        :class="{ selected: buildSelect === 'goldmine' }"
        @click="buildSelect = 'goldmine'" />
      <img
        class="item"
        src="/assets/building/icons/coalmine.gif"
        style="grid-area: coalmine"
        :class="{ selected: buildSelect === 'coalmine' }"
        @click="buildSelect = 'coalmine'" />
      <img
        class="item"
        src="/assets/building/icons/metallurgist.gif"
        style="grid-area: metallurgist"
        :class="{ selected: buildSelect === 'metallurgist' }"
        @click="buildSelect = 'metallurgist'" />
      <img
        class="item"
        src="/assets/building/icons/weaponworkshop.gif"
        style="grid-area: weaponworkshop"
        :class="{ selected: buildSelect === 'weaponworkshop' }"
        @click="buildSelect = 'weaponworkshop'" />
      <!-- 5 row -->
      <img
        class="item"
        src="/assets/building/icons/tannery.gif"
        style="grid-area: tannery"
        :class="{ selected: buildSelect === 'tannery' }"
        @click="buildSelect = 'tannery'" />
      <img
        class="item"
        src="/assets/building/icons/armoryworkshop.gif"
        style="grid-area: armoryworkshop"
        :class="{ selected: buildSelect === 'armoryworkshop' }"
        @click="buildSelect = 'armoryworkshop'" />
      <img
        class="item"
        src="/assets/building/icons/stables.gif"
        style="grid-area: stables"
        :class="{ selected: buildSelect === 'stables' }"
        @click="buildSelect = 'stables'" />
      <img
        class="item"
        src="/assets/building/icons/ironmine.gif"
        style="grid-area: ironmine"
        :class="{ selected: buildSelect === 'ironmine' }"
        @click="buildSelect = 'ironmine'" />
      <img
        class="item"
        src="/assets/building/icons/ironsmithy.gif"
        style="grid-area: ironsmithy"
        :class="{ selected: buildSelect === 'ironsmithy' }"
        @click="buildSelect = 'ironsmithy'" />
      <!-- 6 row -->
      <img
        class="item"
        src="/assets/building/icons/weaponsmithy.gif"
        style="grid-area: weaponsmithy"
        :class="{ selected: buildSelect === 'weaponsmithy' }"
        @click="buildSelect = 'weaponsmithy'" />
      <img
        class="item"
        src="/assets/building/icons/armorsmithy.gif"
        style="grid-area: armorsmithy"
        :class="{ selected: buildSelect === 'armorsmithy' }"
        @click="buildSelect = 'armorsmithy'" />
      <img
        class="item"
        src="/assets/building/icons/barracks.gif"
        style="grid-area: barracks"
        :class="{ selected: buildSelect === 'barracks' }"
        @click="buildSelect = 'barracks'" />
      <img
        class="item"
        src="/assets/building/icons/storehouse.gif"
        style="grid-area: storehouse"
        :class="{ selected: buildSelect === 'storehouse' }"
        @click="buildSelect = 'storehouse'" />
      <img
        class="item"
        src="/assets/building/icons/watchtower.gif"
        style="grid-area: watchtower"
        :class="{ selected: buildSelect === 'watchtower' }"
        @click="buildSelect = 'watchtower'" />
      <!-- 7 row -->
      <img
        class="item"
        src="/assets/building/icons/fisherman.gif"
        style="grid-area: fisherman"
        :class="{ selected: buildSelect === 'fisherman' }"
        @click="buildSelect = 'fisherman'" />

      <img
        class="item"
        src="/assets/building/icons/townhall.gif"
        style="grid-area: townhall"
        :class="{ selected: buildSelect === 'townhall' }"
        @click="buildSelect = 'townhall'" />
      <img
        class="item"
        src="/assets/building/icons/siegeworkshop.gif"
        style="grid-area: siegeworkshop"
        :class="{ selected: buildSelect === 'siegeworkshop' }"
        @click="buildSelect = 'siegeworkshop'" />
      <!-- <img
      class="item"
      src="/assets/building/icons/marketplace.gif"
      style="grid-area: marketplace" /> -->
    </div>
  </div>
</template>

<style scoped>
  #build {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(5, 1fr);
    grid-template-areas:
      'road vines field . delete'
      '. . . . .'
      'school inn quarry woodcutter sawmill'
      'farm mill bakery swinefarm butcher'
      'vineyard goldmine coalmine metallurgist weaponworkshop'
      'tannery armoryworkshop stables ironmine ironsmithy'
      'weaponsmithy armorsmithy barracks storehouse watchtower'
      'fisherman  townhall siegeworkshop marketplace .';

    .item {
      background-color: rgba(0, 0, 0, 0.3);
      overflow: hidden;
      cursor: pointer;
      width: 100%;
      aspect-ratio: 1;
      padding: 0.2rem;
      border-radius: 0.2rem;

      display: flex;
      justify-content: center;
      align-items: center;

      &.selected {
        border: 2px solid white;
      }
    }

    img {
      width: 100%;
      object-fit: contain;
    }
  }
</style>
