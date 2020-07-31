/**
 * @Author : ChangJun
 * @Date : 2019/10/21
 * @Version : 1.0
 * @Content :
 */
module.exports = {
  Interfaces: {
    // 登录模块
    login: {
      login: '/front/login/', // 登录
    },
    // 用户管理模块
    user: {
      getUserList: '/admin/users/', // 用户管理列表
      addUser: '/admin/users/', // 添加用户
      getUser: '/admin/users/', // 查询用户
      editUser: '/admin/users/', // 修改用户
      deleteUser: '/admin/users/', // 删除用户
      getCourtName: '/admin/courts/', // 获取法院名称
      getAllCourt: '/admin/courts/all/', // 获取法院下拉框
      departmentUser: '/admin/department_users/', // 部门用户
      departments: '/admin/departments/', // 部门
    },
    // 类型管理模块
    type: {
      getTypeList: '/admin/boards/', // 类型列表
      addType: '/admin/boards/', // 添加类型
      getType: '/admin/boards/', // 查询类型
      editType: '/admin/boards/', // 修改类型
      deleteType: '/admin/boards/', // 删除类型
      sort: '/admin/boards/sort/', //类型排序
    },
    // 专题管理模块
    subject: {
      getSubjectList: '/admin/topics/', // 类型列表
      addSubject: '/admin/topics/', // 添加类型
      getSubject: '/admin/topics/', // 查询类型
      editSubject: '/admin/topics/', // 修改类型
      deleteSubject: '/admin/topics/', // 删除类型
      sort: '/admin/topics/sort/', //子类型排序
    },
    // 帖子管理模块
    post: {
      getPostList: '/admin/posts/',
      getComments: '/front/posts/', // 帖子评论列表
    },
    // 建言献策管理
    suggestions: {
      handleSuggestions: '/admin/suggestions/',
      handleComments: '/front/suggestions/', // 帖子评论列表
    },
    // 问答管理模块
    answer: {
      getAnswerList: '/admin/questions/',
      delAnswer: '/front/questions/',
      departmentQuestion: '/admin/departments_questions/',
      evaluation: '/admin/evaluations/',
    },
    // 文章
    announcement: {
      addAnnouncement: '/admin/announcements/',
      uploadFile: '/admin/upload/file/', // 一键上传
      uploadPic: '/admin/upload/', // 富文本编辑器中上传图片
      attachment: '/front/file/', // 上传附件
    },
    // 指南
    guide: {
      handleGuide: '/admin/guides/',
    },
    // 学习内容
    learning: {
      getLearnList: '/admin/study/', // 获取列表
      addLearn: '/admin/study/', // 添加
      editLearn: '/admin/study/', // 修改
      deleteLearn: '/admin/study/', // 删除
    },
    // 轮播图
    picture: {
      carousels: '/admin/carousels/', // 新增
      getCarousels: '/admin/carousels/', // 获取轮播图列表
      editCarousels: '/admin/carousels/', // 替换轮播图
      deleteCarousels: '/admin/carousels/', // 删除
    },
    feedback: {
      getFeedback: '/admin/feedback/', // 获取反馈列表
      deleteFeedback: '/admin/feedback/', // 删除
      handelFeedback: '/admin/feedback/', // 处理
      getHotLine: '/admin/hotline/', // 获取热线
      editHotLine: '/admin/hotline/', // 修改热线
    },
    theme: {
      handleTheme: '/admin/theme/',
    },
  },
  Proxy: {
    dev: ['admin', 'front'],
    domain: {
      admin: {
        development: 'http://192.168.11.88:7888/api/v2/admin/', // 本地
        // development: 'http://192.168.11.24:7888/', // 本地
        // development: 'https://t-mfwd.aegis-info.com/api/v2/admin/', // 线上
        release: 'http://192.168.11.24:7888/api/v2/admin/',
        production: 'http://140.0.189.205/',
      },
      front: {
        development: 'http://192.168.11.88:7888/api/v2/', // 本地
        // development: 'http://192.168.11.24:7888/', // 本地
        // development: 'https://t-mfwd.aegis-info.com/api/v2/', // 线上
        release: 'http://192.168.11.24:7888/api/v2/',
        production: 'http://140.0.189.205/',
      },
    },
  },
  ProjectName: 'Admin',
  Code: {
    SUCCESS: 200,
    NO_LIMIT: 401,
    AUTH_FAIL: 2002,
    AUTH_OUT_TIME: 2004,
  }, // 接口请求错误码
};
