<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="ifTitleAndMenuShow">
        <div class="icon-wrapper"><span class="icon-menu icon" @click="showSetting(3)"></span></div>
        <div class="icon-wrapper"><span class="icon-progress icon" @click="showSetting(2)"></span></div>
        <div class="icon-wrapper"><span class="icon-bright icon" @click="showSetting(1)"></span></div>
        <div class="icon-wrapper"><span class="icon-a icon" @click="showSetting(0)">A</span></div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="ifSettingShow">
        <div class="setting-font-size" v-show="showTag === 0">
          <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
          <div class="select-wrapper">
            <div class="select" v-for="(item,index) in fontSizeList" :key="index" @click="setFontSize(item.fontSize)">
              <div class="line"></div>
              <div class="point-wrapper">
                <div class="point" v-show="defaultFontSize === item.fontSize">
                  <div class="small-point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length-1].fontSize + 'px'}">A</div>
        </div>
        <div class="setting-theme" v-show="showTag === 1">
          <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
            <div class="preview" :style="{background: item.style.body.background}"
                 :class="{'no-border': item.style.body.background !== '#fff'}"></div>
            <div class="text" :class="{'selected': index === defaultTheme}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-show="showTag === 2">
          <div class="progress-wrapper">
            <input type="range" class="progress" max="100" min="0" step="1"
                   @change="onProgressChange($event.target.value)"
                   @input="onProgressInput($event.target.value)"
                   :value="progress"
                   :disabled="!bookAvailable"
                   ref="progress"/>
          </div>
          <div class="text-wrapper">
            <span>{{bookAvailable ? progress + "%" : "loading..."}}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view :ifShowContent="ifShowContent"
                  v-show="ifShowContent"
                  :navigation="navigation"
                  :bookAvailable="bookAvailable"
                  @jumpTo="jumpTo"></content-view>
    <transition name="fade">
      <div class="content-mask"
           v-show="ifShowContent"
           @click="hideContent"></div>
    </transition>
  </div>
</template>

<script>
  import ContentView from "./Content";

  export default {
    name: "MenuBar",
    components: {ContentView},
    props: {
      ifTitleAndMenuShow: {
        type: Boolean,
        default: false
      },
      fontSizeList: Array,
      defaultFontSize: Number,
      themeList: Array,
      defaultTheme: Number,
      bookAvailable: Boolean,
      navigation: Object
    },
    data() {
      return {
        ifSettingShow: false,
        showTag: 0,
        progress: 0,
        ifShowContent: false
      }
    },
    methods: {
      jumpTo(href) {
        let loc = this.navigation.tocByHref[href];
        let progress = Math.round(loc / this.navigation.length * 100);
        this.onProgressInput(progress);
        this.$emit("jumpTo", href)
      },
      hideContent() {
        this.ifShowContent = false
      },
      onProgressInput(progress) {
        this.progress = progress
        this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
      },
      onProgressChange(progress) {
        this.$emit("onProgressChange", progress)
      },
      setTheme(index) {
        this.$emit("setTheme", index)
      },
      setFontSize(fontSize) {
        this.$emit("setFontSize", fontSize)
      },
      showSetting(tag) {
        if (tag === 3) {
          this.ifSettingShow = false
          this.ifShowContent = true
        } else {
          this.ifSettingShow = true;
          this.showTag = tag
        }
      },
      hideSetting() {
        this.ifSettingShow = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/global";

  .menu-bar {
    .menu-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 101;
      display: flex;
      width: 100%;
      height: px2rem(48);
      background-color: white;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);

      .icon-wrapper {
        flex: 1;
        @include center;
      }
    }

    .setting-wrapper {
      position: absolute;
      bottom: px2rem(48);
      left: 0;
      z-index: 101;
      width: 100%;
      height: px2rem(60);
      background: white;
      box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);

      .setting-font-size {
        display: flex;
        height: 100%;

        .preview {
          flex: 0 0 px2rem(40);
          @include center;
        }

        .select-wrapper {
          flex: 1;
          display: flex;

          .select {
            flex: 1;
            display: flex;
            align-items: center;

            &:first-child {
              .line {
                &:first-child {
                  border-top: none;
                }
              }
            }

            &:last-child {
              .line {
                &:last-child {
                  border-top: none;
                }
              }
            }

            .line {
              flex: 1;
              height: 0;
              border-top: px2rem(1) solid #ccc;
            }

            .point-wrapper {
              position: relative;
              flex: 0 0 0;
              width: 0;
              height: px2rem(7);
              border-right: px2rem(1) solid #ccc;

              .point {
                position: absolute;
                top: px2rem(-7.5);
                left: px2rem(-10.5);
                width: px2rem(20);
                height: px2rem(20);
                border-radius: 50%;
                border: px2rem(1) solid #ccc;
                background-color: #fff;
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
                @include center;

                .small-point {
                  width: px2rem(4);
                  height: px2rem(4);
                  border-radius: 50%;
                  background: #000;
                }
              }
            }
          }
        }
      }

      .setting-theme {
        display: flex;
        height: 100%;

        .setting-theme-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: px2rem(5);
          box-sizing: border-box;

          .preview {
            flex: 1;
            border: px2rem(1) solid #ccc;
            box-sizing: border-box;

            &.no-border {
              border: none;
            }
          }

          .text {
            flex: 1;
            font-size: px2rem(14);
            color: #ccc;

            &.selected {
              color: #333;
            }
          }
        }
      }

      .setting-progress {
        position: relative;
        width: 100%;
        height: 100%;

        .progress-wrapper {
          width: 100%;
          height: 100%;
          padding: 0 px2rem(30);
          @include center;

          .progress {
            width: 100%;
            height: px2rem(2);
            -webkit-appearance: none;
            background: linear-gradient(#999, #999) no-repeat #ddd;
            background-size: 0 100%;

            &:focus {
              outline: none;
            }

            &::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: white;
              border: px2rem(1) solid #ddd;
              box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, .15);
            }
          }
        }

        .text-wrapper {
          font-size: px2rem(20);
        }
      }
    }

    .content-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 101;
      display: flex;
      background: rgba(51, 51, 51, 0.8);
    }
  }

</style>
