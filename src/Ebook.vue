<template>
  <div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"
              :fontSizeList="fontSizeList"
              :defaultFontSize="defaultFontSize"
              @setFontSize="setFontSize"
              :themeList="themeList"
              :defaultTheme="defaultTheme"
              @setTheme="setTheme"
              :bookAvailable="bookAvailable"
              @onProgressChange="onProgressChange"
              :navigation="navigation"
              @jumpTo="jumpTo"
              ref="menuBar"></menu-bar>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import TitleBar from './components/TitleBar';
  import MenuBar from './components/MenuBar'

  const DOWNLOAD_URL = '/static/cygs.epub'
  /* eslint-disable space-before-function-paren */
  export default {
    name: 'Ebook',
    components: {
      TitleBar,
      MenuBar
    },
    data() {
      return {
        ifTitleAndMenuShow: false,
        fontSizeList: [
          {fontSize: 12},
          {fontSize: 14},
          {fontSize: 16},
          {fontSize: 18},
          {fontSize: 20},
          {fontSize: 22},
          {fontSize: 24}
        ],
        defaultFontSize: 16,
        themeList: [
          {name: "default", style: {body: {color: "#000", background: "#fff"}}},
          {name: "eye", style: {body: {color: "#000", background: "#b2eaa0"}}},
          {name: "night", style: {body: {color: "#eeeeee", background: "#000"}}},
          {name: "gold", style: {body: {color: "#000", background: "#f1ee93"}}}
        ],
        defaultTheme: 0,
        // 书籍可用状态
        bookAvailable: false,
        navigation: {}
      }
    },
    methods: {
      // 根据目录链接跳转到指定位置
      jumpTo(href) {
        this.rendition.display(href);
        this.hideTitleAndMenu()
      },
      hideTitleAndMenu() {
        this.ifTitleAndMenuShow = false
        this.$refs.menuBar.hideSetting()
        this.$refs.menuBar.hideContent()
      },
      /**
       *
       * @param progress 进度条的数值 （0-100）
       */
      onProgressChange(progress) {
        const percentage = progress / 100
        const location = progress > 0 ? this.locations.cfiFromPercentage(percentage) : 0
        this.rendition.display(location)
      },
      setTheme(index) {
        this.themes.select(this.themeList[index].name)
        this.defaultTheme = index
      },
      registerTheme() {
        this.themeList.forEach(item => {
          this.themes.register(item.name, item.style);
        })
      },
      setFontSize(fontSize) {
        this.defaultFontSize = fontSize
        if (this.themes) {
          this.themes.fontSize(fontSize + "px");
        }
      },
      toggleTitleAndMenu() {
        this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
        if (!this.ifTitleAndMenuShow) {
          this.$refs.menuBar.hideSetting()
        }
      },
      prevPage() {
        if (this.rendition) {
          this.rendition.prev()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
        }
      },
      // 电子书的解析和渲染
      showEpub() {
        // 生成Book
        this.ebook = new Epub(DOWNLOAD_URL)
        // 生成Rendition，通过Book.renderTo
        this.rendition = this.ebook.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight
        })
        // 通过Rendition.display渲染电子书
        this.rendition.display()
        // 获取Theme对象
        this.themes = this.rendition.themes
        // 设置默认字体
        this.setFontSize(this.defaultFontSize);
        // this.themes.register(name, styles)
        // this.themes.select(name)
        this.registerTheme()
        this.setTheme(this.defaultTheme)
        //
        this.ebook.ready.then(() => {
          this.navigation = this.ebook.navigation;
          console.log(this.navigation);
          this.ebook.locations.generate()
        }).then(() => {
          this.locations = this.ebook.locations
          console.log(this.locations)
          this.bookAvailable = true
          // this.onProgressChange(100)
        })
      }
    },
    mounted() {
      this.showEpub()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/global";

  .ebook {
    position: relative;

    .read-wrapper {
      .read {
        height: 100%;
      }

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        display: flex;
        width: 100%;
        height: 100%;

        .left {
          flex: 0 0 px2rem(100);
        }

        .center {
          flex: 1;
        }

        .right {
          flex: 0 0 px2rem(100);
        }
      }
    }

  }
</style>
