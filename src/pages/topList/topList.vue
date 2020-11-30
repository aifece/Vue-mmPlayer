<template>
  <!--一周-->
  <div>
    <play-btn
        :list="list"
        @refreshList="refreshList"
      />
    <div class="search">
      <mm-loading v-model="mmLoadShow" />
      <music-list
        ref="musicList"
        :list="list"
        :list-type="2"
        @select="selectItem"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getUserRecord, getMusicDetail } from 'api'
import MmLoading from 'base/mm-loading/mm-loading'
import MusicList from 'components/music-list/music-list'
import PlayBtn from 'components/play-btn/play-btn'
import { loadMixin } from '@/utils/mixin'
import { toHttps } from '@/utils/util'

export default {
  name: 'TopList',
  components: {
    MmLoading,
    PlayBtn,
    MusicList
  },
  mixins: [loadMixin],
  data() {
    return {
      searchValue: '', // 搜索关键词
      Artists: [], // 热搜数组
      list: [], // 搜索数组
      page: 0, // 分页
      lockUp: true // 是否锁定上拉加载事件,默认锁定
    }
  },
  computed: {
    ...mapGetters(['playing', 'currentMusic', 'uid'])
  },
  created() {
    // 获取热搜
    getUserRecord(this.uid).then((list) => {
      this.list = list
      this.mmLoadShow = false
    })
  },
  methods: {
    refreshList() {
      if (this.mmLoadShow) {
        return
      }
      this.mmLoadShow = true
      this.list = []
      getUserRecord(this.uid).then((list) => {
        this.list = list
        this.mmLoadShow = false
      })
    },
    // 播放歌曲
    async selectItem(music) {
      try {
        const image = await this._getMusicDetail(music.id)
        music.image = toHttps(image)
        this.selectAddPlay(music)
      } catch (error) {
        this.$mmToast('哎呀，出错啦~')
      }
    },
    // 获取歌曲详情
    _getMusicDetail(id) {
      return getMusicDetail(id).then((res) => res.songs[0].al.picUrl)
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING'
    }),
    ...mapActions(['selectAddPlay'])
  }
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  width: 100%;
  height: 100%;
  .search-head {
    display: flex;
    height: 40px;
    padding: 10px 15px;
    overflow: hidden;
    background: @search_bg_coloe;
    span {
      line-height: 40px;
      margin-right: 15px;
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
      @media (max-width: 640px) {
        & {
          display: none;
        }
      }
    }
    .search-input {
      flex: 1;
      height: 40px;
      box-sizing: border-box;
      padding: 0 15px;
      border: 1px solid @btn_color;
      outline: 0;
      background: transparent;
      color: @text_color_active;
      font-size: @font_size_medium;
      box-shadow: 0 0 1px 0 #fff inset;
      &::placeholder {
        color: @text_color;
      }
    }
  }
  .musicList {
    width: 100%;
    height: calc(~'100%' - 40px);
  }
}
</style>
