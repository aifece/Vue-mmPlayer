import axios from '@/utils/axios'
import { defaultLimit } from '@/config'
import { formatTopSongs } from '@/utils/song'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL

// 排行榜列表
export function getUserRecord(uid) {
  return new Promise((resolve, reject) => {
    axios
      .get('/record/user', {
        'params': {
          'uid': uid
        }
      })
      .then(({ weekData }) => {
        if (weekData.length === 0) {
          resolve({})
        }
        const ids = weekData
          .slice(0, 500)
          .map(v => v.song.id)
          .toString()
        getMusicDetail(ids).then(({ songs }) => {
          let tracks = formatTopSongs(songs)
          resolve(tracks)
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

// getPlayingList
export function getPlayingList(uid) {
  return axios.get('/user/playing', {
    'params': {
      'uid': uid
    }
  });
}

// 歌单详情
export function getPlaylistDetail(id) {
  return new Promise((resolve, reject) => {
    axios
      .get('/playlist/detail', {
        'params': {
          'id': id
        }
      })
      .then(({ playlist }) => playlist)
      .then(playlist => {
        const { trackIds, tracks } = playlist
        // 过滤完整歌单 如排行榜
        if (tracks.length === trackIds.length) {
          playlist.tracks = formatTopSongs(playlist.tracks)
          resolve(playlist)
          return
        }
        // 限制歌单详情最大 500
        const ids = trackIds
          .slice(0, 500)
          .map(v => v.id)
          .toString()
        getMusicDetail(ids).then(({ songs }) => {
          playlist.tracks = formatTopSongs(songs)
          resolve(playlist)
        })
      })
  })
}

// 搜索
export function search(keywords, type, page = 0, limit = defaultLimit) {
  return axios.get('/search', {
    params: {
      offset: page * limit,
      limit: limit,
      keywords,
      type: type || 1
    }
  })
}

// 热搜
export function searchHot() {
  return axios.get('/search/hot')
}

// 获取用户歌单详情
export function getUserPlaylist(uid) {
  return axios.get('/user/playlist', {
    params: {
      uid
    }
  })
}

// 获取歌曲详情
export function getMusicDetail(ids) {
  return axios.get('/song/detail', {
    params: {
      ids
    }
  })
}

// 获取音乐是否可以用
export function getCheckMusic(id) {
  return axios.get('/check/music', {
    params: {
      id
    }
  })
}

// 获取音乐地址
export function getMusicUrl(id) {
  return axios.get('/song/url', {
    params: {
      id
    }
  })
}

// 获取歌词
export function getLyric(id) {
  const url = '/lyric'
  return axios.get(url, {
    params: {
      id
    }
  })
}

// 获取音乐评论
export function getComment(id, page, limit = defaultLimit) {
  return axios.get('/comment/music', {
    params: {
      offset: page * limit,
      limit: limit,
      id
    }
  })
}
// 获取用户评论
export function getUserComment(id, uid, limit = defaultLimit) {
  return axios.get('/comment/user', {
    params: {
      uid: uid,
      id: id
    }
  })
}
