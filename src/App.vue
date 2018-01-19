<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--播放器组件-->
    <m-player></m-player>
  </div>
</template>

<script>
  import header from '@/components/m-header/m-header'
  import tab from '@/components/tab/tab'
  import player from '@/components/player/player'
  export default {
    name: 'app',
    components: {
      "m-header": header,
      "m-tab":tab,
      "m-player":player
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable"
  #app
    color: $color-theme
</style>
