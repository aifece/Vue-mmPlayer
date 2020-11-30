<template>
  <!--我的歌单-->
  <div>
    <div style="color:white; margin-bottom: 10px;">
      最后更新时间：{{check_time}}
    </div>
    <play-btn
        :list="list"
        @refreshList="refreshList"
      />
    <div class="taList">
      <mm-loading v-model="mmLoadShow" />
      <music-list
        ref="musicList"
        :list="list"
        :list-type="3"
        @select="selectItem"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { getPlayingList, getMusicDetail } from 'api'
import { loadMixin } from '@/utils/mixin'
import MusicList from 'components/music-list/music-list'
import PlayBtn from 'components/play-btn/play-btn'
import MmLoading from 'base/mm-loading/mm-loading'
import { toHttps } from '@/utils/util'
import { formatTopSongs } from '@/utils/song'

export default {
  name: 'TaList',
  components: {
    MmLoading,
    PlayBtn,
    MusicList
  },
  mixins: [loadMixin],
  data() {
    return {
      check_time: '',
      lockUp: true,
      list: [] // 列表
    }
  },
  computed: {
    formatList() {
      return this.list.filter((item) => item.trackCount > 0)
    },
    ...mapGetters(['uid', 'playing', 'currentMusic'])
  },
  watch: {
    uid(newUid) {
      if (newUid) {
        this.mmLoadShow = true
        this._getPlayingList(newUid)
      } else {
        this.list = []
      }
    }
  },
  created() {
    if (!this.uid) {
      this.mmLoadShow = false
    } else {
      this._getPlayingList(this.uid)
    }
  },
  activated() {
    if (this.uid && this.list.length === 0) {
      this.mmLoadShow = true
      this._getPlayingList(this.uid)
    } else if (!this.uid && this.list.length !== 0) {
      this.list = []
    }
  },
  methods: {
    // 获取我的歌单详情
    _getPlayingList(uid) {
      getPlayingList(uid).then((res) => {
        const { result } = res.data
        if (result.length === 0) {
          return
        }
        this.check_time = result[result.length - 1].change_time
        let playList = []
        let timeRelation = {}
        for (let i = result.length - 1; i >= 0; i--) {
          let changeItem = result[i]
          let changeTime = changeItem.change_time
          changeItem.changes.forEach(item => {
            if (!timeRelation[item.id]) {
              timeRelation[item.id] = {
                'first_change_time': changeTime,
                'change_time': changeTime
              }
            }
            if (!inArray(item.id, playList)) {
              playList.push({
                id: item.id,
                name: item.name,
                singer: '',
                change_time: changeTime
              })
              timeRelation[item.id].change_time = changeTime
            }
          })
        }
        this.list = []
        const ids = playList
          .slice(0, 500)
          .map(v => v.id)
          .toString()
        getMusicDetail(ids).then(({ songs }) => {
          let music = formatTopSongs(songs)
          music.forEach(item => {
            item.change_time = timeRelation[item.id].change_time
            item.first_change_time = timeRelation[item.id].first_change_time
            this.list.push(item)
          })
        })
        this._hideLoad()

        function inArray(id, array) {
          array.forEach(item => {
            if (item.id === id) {
              return true
            }
          })
          return false
        }
      })
    },
    refreshList() {
      if (this.mmLoadShow) {
        return
      }
      this.list = []
      this.mmLoadShow = true
      this._getPlayingList(this.uid)
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
.taList {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &-head {
    height: 100px;
  }
  .list-item {
    float: left;
    width: calc(~'100% / 7');
    .taList-item {
      width: 130px;
      text-align: center;
      cursor: pointer;
      margin: 0 auto 20px;
      &:hover {
        color: #fff;
      }
      .name {
        height: 30px;
        line-height: 30px;
        font-size: @font_size_medium;
        .no-wrap();
      }
      @media (max-width: 1100px) {
        width: 80%;
      }
    }
    @media (max-width: 1500px) {
      width: calc(~'100% / 6');
    }
    @media (max-width: 1400px), (max-width: 960px) {
      width: calc(~'100% / 5');
    }
    @media (max-width: 1280px), (max-width: 768px) {
      width: calc(~'100% / 4');
    }
  }
  .musicList {
    width: 100%;
    height: calc(~'100% - 60px');
  }
  @media (max-width: 768px) {
    overflow-x: auto;
    .musicList {
      min-width: 600px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
