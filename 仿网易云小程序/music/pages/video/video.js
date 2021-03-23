// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航标签数据
    navId:'',//导航标识
    videoList:[],//视频列表数据
    videoId:'',//视频id标识
    videoUpdateTime:[],//记录video播放的时长
    isTriggered:false,//标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航数据
    this.getViedoGroupListData();
  },
  //获取导航数据
  async getViedoGroupListData(){
    let ViedoGroupListData = await request(`/video/group/list`)
    this.setData({
      videoGroupList: ViedoGroupListData.data.slice(0,14),
      navId:ViedoGroupListData.data[0].id
    })
    //获取视频列表数据
    this.getVideoList(this.data.navId);
  },
  //获取视频列表数据
  async getVideoList(navId){
    let videoListData=await request(`/video/group`,{id:navId})
    //关闭提示框
    wx.hideLoading();
    let index=0;
    let videoList =videoListData.datas.map(item=>{
      item.id=index++;
      return item;
    })
    this.setData({
      videoList,
      isTriggered: false//关闭下拉刷新
    })
  },

  //点击切换导航的回调
  changeNav(event){
    let navId=event.currentTarget.id;
    this.setData({
      navId,
      videoList:[]
    })

    //动态获取当前导航对应的视频数据
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId);
  },
  handlePlay(event) {
    /*
    需求：
     1、在点击播放的事件中需要找到上一个播放的视频
     2、在播放新的视频之前关闭上一个正在播放的视频
    关键：
     1、如何找到上一个视频的实例对象
     */
    let vid = event.currentTarget.id;
    //关闭上一个播放的视频
    // this.vid!==vid&&this.videoContext && this.videoContext.stop();
    // this.vid=vid;

    //更新data种videoId的状态数据
    this.setData({
      videoId:vid
    })
    
    //创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    //判断当前的视频之前是否有播放过，似乎否有播放记录，如果有，跳转至指定的播放位置
    let {videoUpdateTime}=this.data;
    let videoItem=videoUpdateTime.find(item => item.vid ===vid);
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime);
    }
    this.videoContext.play();
  },
  //监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj={vid:event.currentTarget.id,currentTime:event.detail.currentTime};
    let {videoUpdateTime}=this.data;
    /*
    思路：判断记录播放时长的videoUpdateTime数组种是否有当前视频的播放记录
    1、如果有，在原有的播放记录中修改播放时间为当前的播放时间
    2、如果没有，需要在数组中添加当前视频的播放对象
    */
    let videoItem=videoUpdateTime.find(item => item.vid===videoTimeObj.vid);
    if(videoItem){//之前有播放记录
    videoItem.currentTime=event.detail.currentTime;
    }else{
      videoUpdateTime.push(videoTimeObj);
    }
    //更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },
  //视频播放结束调用的回调
  handleEnded(event){
    let {videoUpdateTime}=this.data;
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid ===event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },
  //自定义下拉刷新的回调：scroll-view
  handleRefresher(event){
    this.getVideoList(this.data.navId);
  },
  //自定义上拉触底回调scroll-view
  handleTolower(event){
    let newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_9848EAA51EFBD85318D8CB3B20B28F6F",
          "coverUrl": "https://p1.music.126.net/uX0WbF-MO_nRYsBv6sUyng==/109951163572706233.jpg",
          "height": 540,
          "width": 540,
          "title": "真不能被一个人的外表所迷惑……",
          "description": "真不能被一个人的外表所迷惑……",
          "commentCount": 226,
          "shareCount": 375,
          "resolutions": [
            {
              "resolution": 240,
              "size": 7224624
            },
            {
              "resolution": 480,
              "size": 10321610
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/NrINx4mDAb-xmmdISc22Iw==/1369991489406144.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1004400,
            "birthday": 724608000000,
            "userId": 135257924,
            "userType": 204,
            "nickname": "YouTube翻唱精选",
            "signature": "发布最新最快的高清翻唱MV，欢迎关注。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 1369991489406144,
            "backgroundImgId": 2002210674180198,
            "backgroundUrl": "http://p1.music.126.net/i0qi6mibX8gq2SaLF1bYbA==/2002210674180198.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "欧美音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "1369991489406144",
            "backgroundImgIdStr": "2002210674180198"
          },
          "urlInfo": {
            "id": "9848EAA51EFBD85318D8CB3B20B28F6F",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Rv6tzMJn_43772903_hd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=FkkyiIPhPNcduLsbsvThobNlJBpeGrvd&sign=4452b4f4eac93768796e9d58c9858581&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 10321610,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": 3101,
              "name": "综艺",
              "alg": "groupTagRank"
            },
            {
              "id": 13172,
              "name": "欧美",
              "alg": "groupTagRank"
            },
            {
              "id": 16131,
              "name": "英文",
              "alg": "groupTagRank"
            },
            {
              "id": 4101,
              "name": "娱乐",
              "alg": "groupTagRank"
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [
            109
          ],
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "9848EAA51EFBD85318D8CB3B20B28F6F",
          "durationms": 60047,
          "playTime": 625603,
          "praisedCount": 5089,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_8B83C174C89637F55265DB0DC7285173",
          "coverUrl": "https://p1.music.126.net/ka23t2gRM8kf5G0oDXsOow==/109951163809638363.jpg",
          "height": 720,
          "width": 1280,
          "title": "看完王嘉尔这个现场表演，很难不被圈粉吧，毫无抵抗力！",
          "description": "王嘉尔《OKAY》极致诱惑舞台，酒红色衬衫，迷人烟嗓，简直就是大型圈粉现场，粉丝的尖叫声说明了一切！",
          "commentCount": 726,
          "shareCount": 2088,
          "resolutions": [
            {
              "resolution": 240,
              "size": 23254348
            },
            {
              "resolution": 480,
              "size": 38540978
            },
            {
              "resolution": 720,
              "size": 55323115
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 340000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 340100,
            "birthday": -2209017600000,
            "userId": 479954154,
            "userType": 201,
            "nickname": "音乐诊疗室",
            "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18499283139231828,
            "backgroundImgId": 1364493978647983,
            "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "18499283139231828",
            "backgroundImgIdStr": "1364493978647983",
            "avatarImgId_str": "18499283139231828"
          },
          "urlInfo": {
            "id": "8B83C174C89637F55265DB0DC7285173",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/OYo1BVHf_2269652534_shd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=AaKdrwsiDVcPSKNvFUTHWdKaqHCfUTRE&sign=4a4249f4f754ce3f5207930a1213f2a3&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 55323115,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": -22607,
              "name": "#hiphop『国产高质量』#",
              "alg": "groupTagRank"
            },
            {
              "id": 9102,
              "name": "演唱会",
              "alg": "groupTagRank"
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "OKAY",
              "id": 521416228,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 1083118,
                  "name": "王嘉尔",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 16,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 36870061,
                "name": "OKAY",
                "picUrl": "http://p4.music.126.net/2lEKh1iJAoyiSyGFsL7z-w==/109951163072695320.jpg",
                "tns": [],
                "pic_str": "109951163072695320",
                "pic": 109951163072695330
              },
              "dt": 192729,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7711391,
                "vd": -27100
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4626852,
                "vd": -24700
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3084582,
                "vd": -23100
              },
              "a": null,
              "cd": "01",
              "no": 0,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 456010,
              "mv": 5741162,
              "publishTime": 1511971200007,
              "privilege": {
                "id": 521416228,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 64,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "8B83C174C89637F55265DB0DC7285173",
          "durationms": 226627,
          "playTime": 1942410,
          "praisedCount": 15109,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_D682ECECA92667925B052268A5D2387B",
          "coverUrl": "https://p1.music.126.net/RaISlHlniH3hnmiWPwRLlg==/109951164005339447.jpg",
          "height": 1080,
          "width": 1920,
          "title": "神一般的钢琴手 这曲《加勒比海盗》带给你意想不到的震撼。",
          "description": " 神一般的钢琴手 这曲《加勒比海盗》带给你意想不到的震撼。",
          "commentCount": 1420,
          "shareCount": 2277,
          "resolutions": [
            {
              "resolution": 240,
              "size": 57254712
            },
            {
              "resolution": 480,
              "size": 124604359
            },
            {
              "resolution": 720,
              "size": 135896139
            },
            {
              "resolution": 1080,
              "size": 282827845
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 450000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/6aH61D-vK2cNkjjg4EszXg==/109951165303381773.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 450100,
            "birthday": 692121600000,
            "userId": 265449953,
            "userType": 204,
            "nickname": "John_分享_",
            "signature": "善良，无畏，谦卑，纯粹。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165303381780,
            "backgroundImgId": 109951165293886380,
            "backgroundUrl": "http://p1.music.126.net/yNFZ6HcdAhx_QL0ckEoTwA==/109951165293886388.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "泛生活视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951165303381773",
            "backgroundImgIdStr": "109951165293886388",
            "avatarImgId_str": "109951165303381773"
          },
          "urlInfo": {
            "id": "D682ECECA92667925B052268A5D2387B",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/syrsh6xn_2450268951_uhd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=gmvfnjvmcagHeTuUdqAUpmTRKaPUUQmR&sign=8122aadd62982048f8fa2e1f943ccd5e&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 282827845,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": -10100,
              "name": "#大气磅礴，史诗级背景音乐。#",
              "alg": "groupTagRank"
            },
            {
              "id": 59106,
              "name": "街头表演",
              "alg": "groupTagRank"
            },
            {
              "id": 26117,
              "name": "钢琴",
              "alg": "groupTagRank"
            },
            {
              "id": 57114,
              "name": "钢琴演奏",
              "alg": "groupTagRank"
            },
            {
              "id": 23128,
              "name": "纯音乐",
              "alg": "groupTagRank"
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": "groupTagRank"
            },
            {
              "id": 4103,
              "name": "演奏",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "He's a Pirate",
              "id": 1620506,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 37542,
                  "name": "Klaus Badelt",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 1,
              "v": 83,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 164579,
                "name": "Pirates of the Caribbean: The Curse of the Black Pearl",
                "picUrl": "http://p4.music.126.net/BJO-Ar_3QMs6BNzK6ZfJrw==/837827860415832.jpg",
                "tns": [],
                "pic": 837827860415832
              },
              "dt": 90000,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 3632229,
                "vd": -2
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 2179403,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 1452990,
                "vd": -2
              },
              "a": null,
              "cd": "1",
              "no": 15,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7003,
              "mv": 0,
              "publishTime": 1058803200007,
              "privilege": {
                "id": 1620506,
                "fee": 1,
                "payed": 0,
                "st": 0,
                "pl": 0,
                "dl": 0,
                "sp": 0,
                "cp": 0,
                "subp": 0,
                "cs": false,
                "maxbr": 320000,
                "fl": 0,
                "toast": false,
                "flag": 1028,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "D682ECECA92667925B052268A5D2387B",
          "durationms": 429802,
          "playTime": 4172287,
          "praisedCount": 30431,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_DA39EB70E9223F378554A3ABB028288C",
          "coverUrl": "https://p1.music.126.net/vziiN8Wk0NPh6LjF3hN6kg==/109951163690324283.jpg",
          "height": 720,
          "width": 1264,
          "title": "日本声优现场燃炸了，打call太疯狂！",
          "description": "GARNiDELiA x 春奈露娜《only my railgun》日本声优现场燃炸了，打call太疯狂！",
          "commentCount": 2429,
          "shareCount": 1974,
          "resolutions": [
            {
              "resolution": 240,
              "size": 27195040
            },
            {
              "resolution": 480,
              "size": 44468403
            },
            {
              "resolution": 720,
              "size": 55870617
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/VPGeeVnQ0jLp4hK9kj0EPg==/18897306347016806.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1002400,
            "birthday": -2209017600000,
            "userId": 449979212,
            "userType": 0,
            "nickname": "全球潮音乐",
            "signature": "有时候音乐是陪我熬过那些夜晚的唯一朋友。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18897306347016810,
            "backgroundImgId": 18987466300481468,
            "backgroundUrl": "http://p1.music.126.net/qx6U5-1LCeMT9t7RLV7r1A==/18987466300481468.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "华语音乐|欧美音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "18897306347016806",
            "backgroundImgIdStr": "18987466300481468",
            "avatarImgId_str": "18897306347016806"
          },
          "urlInfo": {
            "id": "DA39EB70E9223F378554A3ABB028288C",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/MabB26aY_2149368680_shd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=MvbuESfrFrqgkNxPrQYSLpVRgcogDJIJ&sign=9f148ba1ae667a5799f9793374d28995&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6SjqmF8pAHnCQ4rBG5PLMHh",
            "size": 55870617,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": -8010,
              "name": "#999+评论#",
              "alg": "groupTagRank"
            },
            {
              "id": 59119,
              "name": "ACG",
              "alg": "groupTagRank"
            },
            {
              "id": 60101,
              "name": "日语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 14146,
              "name": "兴奋",
              "alg": "groupTagRank"
            },
            {
              "id": 9102,
              "name": "演唱会",
              "alg": "groupTagRank"
            },
            {
              "id": 4105,
              "name": "摇滚",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "DA39EB70E9223F378554A3ABB028288C",
          "durationms": 244391,
          "playTime": 3717067,
          "praisedCount": 17097,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_EC849816884F107BD9233D3C068B2E46",
          "coverUrl": "https://p1.music.126.net/6GsFbQGuJbmzAtx5UKXqMQ==/109951163610173922.jpg",
          "height": 640,
          "width": 360,
          "title": "那个洪真英御用伴舞大长腿妹子的饭拍视频来了！ring ring跳得好",
          "description": null,
          "commentCount": 58,
          "shareCount": 122,
          "resolutions": [
            {
              "resolution": 480,
              "size": 89297587
            },
            {
              "resolution": 240,
              "size": 50152791
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/YmIs3mRXXlMeClptHFKjtw==/6008831046459977.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 1005100,
            "birthday": -2209017600000,
            "userId": 19741919,
            "userType": 0,
            "nickname": "若如再见",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 6008831046459977,
            "backgroundImgId": 6011030069715526,
            "backgroundUrl": "http://p1.music.126.net/LYdbria11OCgSpIvlPo4ow==/6011030069715526.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "6008831046459977",
            "backgroundImgIdStr": "6011030069715526"
          },
          "urlInfo": {
            "id": "EC849816884F107BD9233D3C068B2E46",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/yUHoWKe8_2055913709_hd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=MXIMvunQyQodonvvaurRbRfDDJMALcmv&sign=30b8751e42ec5332047d81454cd04bd3&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 89297587,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [
            {
              "id": 57107,
              "name": "韩语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57110,
              "name": "饭拍现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "따르릉 (작곡가 Ver.)",
              "id": 473602603,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 125394,
                  "name": "洪真英",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 95,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 18,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 35377231,
                "name": "Ring Ring",
                "picUrl": "http://p3.music.126.net/RdNts9bsXd3YvaLoODeDdQ==/18735678139195750.jpg",
                "tns": [],
                "pic_str": "18735678139195750",
                "pic": 18735678139195750
              },
              "dt": 197195,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7890068,
                "vd": -37600
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4734058,
                "vd": -35200
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3156053,
                "vd": -34300
              },
              "a": null,
              "cd": "1",
              "no": 2,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1410822,
              "mv": 0,
              "publishTime": 1492617600000,
              "tns": [
                "Ring Ring (作曲家 Ver.)"
              ],
              "privilege": {
                "id": 473602603,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 68,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "EC849816884F107BD9233D3C068B2E46",
          "durationms": 192900,
          "playTime": 294511,
          "praisedCount": 608,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_385B7220CD808CF8DA668763EA99A94E",
          "coverUrl": "https://p1.music.126.net/vU_WyhcOIh1O_JKTIxT0WQ==/109951163425299899.jpg",
          "height": 720,
          "width": 1280,
          "title": "若不是因车祸英年早逝，他的音乐成就将难以估量！",
          "description": "若不是因车祸英年早逝，他的音乐成就将难以估量，一开口就惊为天人！",
          "commentCount": 770,
          "shareCount": 279,
          "resolutions": [
            {
              "resolution": 240,
              "size": 10223560
            },
            {
              "resolution": 480,
              "size": 16842942
            },
            {
              "resolution": 720,
              "size": 28669158
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 340000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 340100,
            "birthday": -2209017600000,
            "userId": 479954154,
            "userType": 201,
            "nickname": "音乐诊疗室",
            "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18499283139231828,
            "backgroundImgId": 1364493978647983,
            "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "18499283139231828",
            "backgroundImgIdStr": "1364493978647983",
            "avatarImgId_str": "18499283139231828"
          },
          "urlInfo": {
            "id": "385B7220CD808CF8DA668763EA99A94E",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/NicYaehT_1816200448_shd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=JnRhtKqsUnUPtWKZpHAxtKrUcjRfpsiv&sign=0354c2c0263268097b76a9ef16aca163&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 28669158,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": -16117,
              "name": "#怀旧经典老歌#",
              "alg": "groupTagRank"
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": "groupTagRank"
            },
            {
              "id": 15136,
              "name": "怀旧",
              "alg": "groupTagRank"
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "我的未来不是梦",
              "id": 5279696,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 6459,
                  "name": "张雨生",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "600902000009555941",
              "fee": 0,
              "v": 669,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 513560,
                "name": "惊世记录Ⅱ",
                "picUrl": "http://p3.music.126.net/qVUJ9aDeRop5pj3QDixIsQ==/109951163353510177.jpg",
                "tns": [],
                "pic_str": "109951163353510177",
                "pic": 109951163353510180
              },
              "dt": 313339,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 12574421,
                "vd": -0.000265076
              },
              "m": {
                "br": 160000,
                "fid": 0,
                "size": 6313393,
                "vd": 0.0675927
              },
              "l": {
                "br": 96000,
                "fid": 0,
                "size": 3808564,
                "vd": -0.000265076
              },
              "a": null,
              "cd": "1",
              "no": 8,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 5003,
              "mv": 5347065,
              "publishTime": 799603200000,
              "privilege": {
                "id": 5279696,
                "fee": 0,
                "payed": 0,
                "st": 0,
                "pl": 320000,
                "dl": 320000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 320000,
                "fl": 320000,
                "toast": false,
                "flag": 128,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "385B7220CD808CF8DA668763EA99A94E",
          "durationms": 166272,
          "playTime": 702809,
          "praisedCount": 2369,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_3060C0537047DFD4E383734090224556",
          "coverUrl": "https://p1.music.126.net/tKZ4_GiKY8oIbnc_eFInIA==/109951163950985966.jpg",
          "height": 1080,
          "width": 1920,
          "title": "华晨宇- 一人饮酒醉 - 天籁之战2现场",
          "description": "",
          "commentCount": 215,
          "shareCount": 477,
          "resolutions": [
            {
              "resolution": 240,
              "size": 32511202
            },
            {
              "resolution": 480,
              "size": 56275989
            },
            {
              "resolution": 720,
              "size": 87354035
            },
            {
              "resolution": 1080,
              "size": 175988386
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 230000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/-iDzYkdA4vLyZvSZWFzC_Q==/109951163708981508.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 230100,
            "birthday": 828288000000,
            "userId": 587194274,
            "userType": 0,
            "nickname": "私人音乐空间",
            "signature": "新浪微博@耳朵都听怀孕了",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163708981500,
            "backgroundImgId": 109951162868128400,
            "backgroundUrl": "http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "视频达人(华语、音乐现场)"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163708981508",
            "backgroundImgIdStr": "109951162868128395",
            "avatarImgId_str": "109951163708981508"
          },
          "urlInfo": {
            "id": "3060C0537047DFD4E383734090224556",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/QEtyprGc_2399800648_uhd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=EbOChgfagyuSnsPxeTXUlPfjFlOJSgPU&sign=2505d2f401bd37be5732fcfe1edb0a31&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 175988386,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 77102,
              "name": "内地综艺",
              "alg": "groupTagRank"
            },
            {
              "id": 23118,
              "name": "华晨宇",
              "alg": "groupTagRank"
            },
            {
              "id": 76108,
              "name": "综艺片段",
              "alg": "groupTagRank"
            },
            {
              "id": 3101,
              "name": "综艺",
              "alg": "groupTagRank"
            },
            {
              "id": 4101,
              "name": "娱乐",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "3060C0537047DFD4E383734090224556",
          "durationms": 212426,
          "playTime": 272138,
          "praisedCount": 2390,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_D5735D6E71F0C7D34A7FF7FC3879A9DF",
          "coverUrl": "https://p1.music.126.net/c9LpI3XMOvYgkcZtvuCjXA==/109951163573601406.jpg",
          "height": 720,
          "width": 1280,
          "title": "《All Falls Down》听一遍就忍不住抖腿了，开口酥啊！",
          "description": "Alan Walker ft. Noah Cyrus 《All Falls Down》听一遍就忍不住抖腿了，开口酥啊！",
          "commentCount": 1648,
          "shareCount": 3680,
          "resolutions": [
            {
              "resolution": 240,
              "size": 27621374
            },
            {
              "resolution": 480,
              "size": 38168053
            },
            {
              "resolution": 720,
              "size": 58553557
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/VPGeeVnQ0jLp4hK9kj0EPg==/18897306347016806.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 1002400,
            "birthday": -2209017600000,
            "userId": 449979212,
            "userType": 0,
            "nickname": "全球潮音乐",
            "signature": "有时候音乐是陪我熬过那些夜晚的唯一朋友。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18897306347016810,
            "backgroundImgId": 18987466300481468,
            "backgroundUrl": "http://p1.music.126.net/qx6U5-1LCeMT9t7RLV7r1A==/18987466300481468.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人",
              "2": "华语音乐|欧美音乐资讯达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "18897306347016806",
            "backgroundImgIdStr": "18987466300481468",
            "avatarImgId_str": "18897306347016806"
          },
          "urlInfo": {
            "id": "D5735D6E71F0C7D34A7FF7FC3879A9DF",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/XLPpEYNW_1624893373_shd.mp4?ts=1610468689&rid=764A3578E97054D436AEAB415F2D1C6F&rl=3&rs=zyFjagFaVtkpyHRUwMiwttAmDpotWxrt&sign=fe3a91335c00ebd814a96a374b06e78d&ext=Ra13m0NGuHQUVsM838hoYnfMhdzzrhJTqyYJiXXjWWebZ9Ws0fqWf%2BpfL5ObLIfzWmL3EZ%2FZ08dVMBqXfegDFneoz1sRLuRg07bfnt11%2FuvsvyvZ92UwvGNIruhUqVDvz%2FnRjCVeaD19yndUK7Es5kqUVl6ERWjl1jW%2Fm573nivl1DVYxtlziQislCR6mToFapGDfNkuoRPc9bB28MJO6%2BIZOP33mPvCA4TKnl98t6RIEse0qDjvUWoWgSMWpQ%2Fh",
            "size": 58553557,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 15249,
              "name": "Alan Walker",
              "alg": "groupTagRank"
            },
            {
              "id": 9136,
              "name": "艾兰·沃克",
              "alg": "groupTagRank"
            },
            {
              "id": 9104,
              "name": "电子",
              "alg": "groupTagRank"
            },
            {
              "id": 4104,
              "name": "电音",
              "alg": "groupTagRank"
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": "groupTagRank"
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": "groupTagRank"
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": "groupTagRank"
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": "groupTagRank"
            },
            {
              "id": 58100,
              "name": "现场",
              "alg": "groupTagRank"
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": "groupTagRank"
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "All Falls Down",
              "id": 515453363,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 1045123,
                  "name": "Alan Walker",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 12175271,
                  "name": "Noah Cyrus",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 840929,
                  "name": "Digital Farm Animals",
                  "tns": [],
                  "alias": []
                },
                {
                  "id": 12647253,
                  "name": "Juliander",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 129,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 36682047,
                "name": "All Falls Down",
                "picUrl": "http://p3.music.126.net/rTb28CZeLWxIRuSlJWkPLQ==/18850027346628137.jpg",
                "tns": [],
                "pic_str": "18850027346628137",
                "pic": 18850027346628136
              },
              "dt": 199111,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 7967391,
                "vd": -35300
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 4780452,
                "vd": -33000
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3186982,
                "vd": -31500
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7001,
              "mv": 5694021,
              "publishTime": 1509062400000,
              "privilege": {
                "id": 515453363,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "D5735D6E71F0C7D34A7FF7FC3879A9DF",
          "durationms": 195954,
          "playTime": 4884213,
          "praisedCount": 30161,
          "praised": false,
          "subscribed": false
        }
      }
    ];
   let videoList=this.data.videoList;
   //将视频最新的数据更新原有视频列表数据中
    videoList.push(...newVideoList);
    this.setData({
      videoList
    })
  },
  toSearch(event){
    wx.navigateTo({
      url:'/pages/search/search'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
      console.log(res.from)
      if(res.from==="button"){
        return{
          title: "button的转发",
          path: "/pages/video/video",
          imageUrl:"/static/images/logo.png"
        }
      } else {
        return {
          title: "menu的转发",
          path: "/pages/video/video",
          imageUrl: "/static/images/logo.png"
        }
      }
  }
})