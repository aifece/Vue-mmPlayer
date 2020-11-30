<template>
  <!--歌曲列表-->
  <div class="list-btn">
    <span @click="playAll">全部播放</span>
    <span @click="addToPlay">添加到播放列表</span>
    <span @click="refreshList">刷新列表</span>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'PlayBtn',
  props: {
    // 歌曲数据
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 播放暂停事件
    playAll() {
      this.setPlaying(false)
      let list = this.list
      this.setPlaylist(list)
      this.setCurrentIndex(0)
      this.setPlaying(true)
    },
    addToPlay() {
      this.list.forEach(music => {
        this.addToPlayList(music)
      })
    },
    refreshList() {
      this.$emit('refreshList')
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENTINDEX'
    }),
    ...mapActions(['addToPlayList'])
  }
}
</script>

<style lang="less" scoped>
.list-btn {
  width: 100%;
  height: 40px;
  font-size: 0;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  span {
    display: inline-block;
    height: 30px;
    box-sizing: border-box;
    margin-right: 8px;
    padding: 0 10px;
    border: 1px solid @btn_color;
    color: @btn_color;
    border-radius: 2px;
    font-size: 14px;
    line-height: 30px;
    overflow: hidden;
    cursor: pointer;
    &:nth-last-of-type(1) {
      margin: 0;
    }
    &:hover,
    &.active {
      border-color: @btn_color_active;
      color: @btn_color_active;
    }
  }
  @media (min-width: 960px) {
    span.show-960 {
      display: none;
    }
  }
  @media (max-width: 960px) {
    span.show-960 {
      display: inline-block;
    }
  }
}
</style>
