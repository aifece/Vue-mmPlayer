<template>
  <!--搜索-->
  <div class="search">
    <mm-loading v-model="mmLoadShow" />
    <div class="search-head">
      <span
        v-for="(item, index) in searchTypeList"
        :key="index"
        :style="{ true: 'color:#FFFFFF;', false: '' }[item.type == searchType]"
        @click="switchType(item.type)"
      >
        {{ item.name }}
      </span>
      <input
        v-model.trim="searchValue"
        class="search-input"
        type="text"
        placeholder="音乐/歌手"
        @keyup.enter="onEnter"
      />
    </div>
    <music-list
      ref="musicList"
      :hidden="searchType === 1002"
      :list="list"
      :list-type="2"
      @select="selectItem"
      @pullUp="pullUpLoad"
    />
    <user-list
      ref="userList"
      :hidden="searchType !== 1002"
      :list="userList"
      @pullUp="pullUpLoad"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { search, getMusicDetail } from 'api'
import formatSongs from '@/utils/song'
import MmLoading from 'base/mm-loading/mm-loading'
import MusicList from 'components/music-list/music-list'
import UserList from 'components/user-list/user-list'
import { loadMixin } from '@/utils/mixin'
import { toHttps } from '@/utils/util'

export default {
  name: 'Search',
  components: {
    MmLoading,
    MusicList,
    UserList
  },
  mixins: [loadMixin],
  data() {
    return {
      searchValue: '', // 搜索关键词
      searchTypeList: [
        {
          name: '歌曲',
          type: 1
        },
        {
          name: '用户',
          type: 1002
        }
      ], // 热搜数组
      searchType: 1,
      list: [], // 搜索数组
      userList: [],
      page: 0, // 分页
      lockUp: true // 是否锁定上拉加载事件,默认锁定
    }
  },
  computed: {
    ...mapGetters(['playing', 'currentMusic'])
  },
  watch: {
    list(newList, oldList) {
      if (newList.length !== oldList.length) {
        this.lockUp = false
      } else if (
        newList[newList.length - 1].id !== oldList[oldList.length - 1].id
      ) {
        this.lockUp = false
      }
    }
  },
  created() {
    this._hideLoad()
  },
  methods: {
    // 点击热搜
    clickHot(name) {
      this.searchValue = name
      this.onEnter()
    },
    // 搜索事件
    onEnter() {
      if (this.searchValue.replace(/(^\s+)|(\s+$)/g, '') === '') {
        this.$mmToast('搜索内容不能为空！')
        return
      }
      this.mmLoadShow = true
      this.page = 0
      if (this.list.length > 0) {
        if (this.searchType === 1002) {
          this.$refs.userList.scrollTo()
        } else {
          this.$refs.musicList.scrollTo()
        }
      }
      search(this.searchValue, this.searchType).then(({ result }) => {
        if (this.searchType === 1002) {
          this.userList = result.userprofiles
        } else {
          if (!result.songs) {
            this.$mmToast('没有更多歌曲啦！')
            return
          }
          this.list = formatSongs(result.songs)
        }
        this._hideLoad()
      })
    },
    switchType(type) {
      this.searchType = type
      this.onEnter()
    },
    // 滚动加载事件
    pullUpLoad() {
      this.page += 1
      search(this.searchValue, this.searchType, this.page).then(
        ({ result }) => {
          if (this.searchType === 1002) {
            this.userList = [...this.userList, ...result.userprofiles]
          } else {
            if (!result.songs) {
              this.$mmToast('没有更多歌曲啦！')
              return
            }
            this.list = [...this.list, ...formatSongs(result.songs)]
          }
        }
      )
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
    height: calc(~'100% - 50px');
  }
}
</style>
