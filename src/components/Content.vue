<template>
  <div class="content-wrapper">
    <div class="content" v-if="bookAvailable">
      <div class="content-item"
           v-for="(item, index) in navigation.toc"
           :key="index"
           @click="jumpTo(item.href)">
        <span class="text">{{item.label}}</span>
      </div>
    </div>
    <div class="empty" v-if="!bookAvailable">Loading...</div>
  </div>
</template>

<script>
  export default {
    name: "ContentView",
    props: {
      bookAvailable: Boolean,
      navigation: Object
    },
    methods: {
      jumpTo(href) {
        this.$emit("jumpTo", href);
      }
    },
    mounted() {
      console.log(this.navigation);
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/global";

  .content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    z-index: 102;
    background: white;

    .content {
      width: 100%;
      height: 100%;
      overflow-y: auto;

      .content-item {
        padding: px2rem(20) px2rem(15);
        border-bottom: px2rem(1) solid #f4f4f4;
        .text {
          font-size: px2rem(14);
          color: #333;
        }
      }
    }

    .empty {
      width: 100%;
      height: 100%;
      @include center;
      font-size: px2rem(16);
      color: #333;
    }
  }
</style>
