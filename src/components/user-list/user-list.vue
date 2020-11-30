<template>
  <div class="musicList">
    <template v-if="list.length > 0">
      <div class="list-item list-header">
        <span class="list-name">uid</span>
        <span class="list-name">昵称</span>
        <span class="list-album">头像</span>
      </div>
      <div ref="userListContent" class="list-content" @scroll="listScroll($event)">
        <div v-for="item in list" :key="item.id" class="list-item">
          <div class="list-name">
            <span>{{ item.userId }}</span>
          </div>
          <div class="list-name">
            <span>{{ item.nickname }}</span>
          </div>
          <div class="list-album">
            <img
              :src="item.avatarUrl"
              style="width: 50px; height: 50px"
              alt=""
            />
          </div>
        </div>
        <slot name="listBtn"></slot>
      </div>
    </template>
    <mm-no-result v-else title="弄啥呢，怎么啥也没有！！！" />
  </div>
</template>

<script>
import MmNoResult from 'base/mm-no-result/mm-no-result'

export default {
  name: 'UserList',
  components: {
    MmNoResult
  },
  props: {
    // 歌曲数据
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lockUp: false // 是否锁定滚动加载事件,默认锁定
    }
  },
  watch: {
    list(newList, oldList) {
      this.lockUp = false
    }
  },
  activated() {
    this.scrollTop &&
      this.$refs.userListContent &&
      (this.$refs.userListContent.scrollTop = this.scrollTop)
  },
  methods: {
    // 滚动事件
    listScroll(e) {
      const scrollTop = e.target.scrollTop
      this.scrollTop = scrollTop
      if (this.lockUp) {
        return
      }
      const { scrollHeight, offsetHeight } = e.target
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        this.lockUp = true // 锁定滚动加载
        this.$emit('pullUp') // 触发滚动加载事件
      }
    },
    // 回到顶部
    scrollTo() {
      if (typeof (this.$refs.userListContent) !== 'undefined') {
        this.$refs.userListContent.scrollTop = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;

  .list-name {
    padding-left: 40px;
    user-select: none;
  }
}

.list-content {
  width: 100%;
  height: calc(~'100% - 60px');
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.list-no {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: @text_color;
}

.list-item {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 50px;
  overflow: hidden;

  &.list-item-no {
    justify-content: center;
    align-items: center;
  }

  &.on {
    color: #fff;

    .list-num {
      font-size: 0;
      background: url('~assets/img/wave.gif') no-repeat center center;
    }
  }

  &:hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }
  }

  &:not([class*='list-header']):hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }

    .list-time {
      font-size: 0;

      .list-menu-icon-del {
        display: block;
      }
    }
  }

  .list-num {
    display: block;
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }

  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;

    & > span {
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    small {
      margin-left: 5px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /*hover菜单*/

    .list-menu {
      display: none;
      position: absolute;
      top: 50%;
      right: 10px;
      height: 40px;
      font-size: 0;
      transform: translateY(-50%);
    }
  }

  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    @media (max-width: 1440px) {
      width: 200px;
    }
    @media (max-width: 1200px) {
      width: 150px;
    }
  }

  .list-time {
    display: block;
    width: 60px;
    position: relative;

    .list-menu-icon-del {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}

@media (max-width: 960px) {
  .list-item .list-name {
    padding-right: 70px;
  }
}

@media (max-width: 768px) {
  .list-item {
    .list-name .list-menu {
      display: block;
    }

    .list-artist,
    .list-album {
      width: 20%;
    }
  }
}

@media (max-width: 640px) {
  .list-item {
    .list-artist {
      width: 80px;
    }

    .list-album,
    .list-time {
      display: none;
    }
  }
}
</style>
