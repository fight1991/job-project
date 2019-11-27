<template>
  <div class="leftSolider">
    <el-menu
      v-permissions='$store.state.childSys.permissions'
      :default-active="$route.path" router
      :collapse='$store.state.collapse'>
      <template v-for="item in menus">
        <!-- 一级菜单 -->
        <el-submenu :index="item.path" :key="item.path" v-if="item.children && !item.hidden" v-permissions="item.permissions">
          <template slot="title">
            <i :class=" 'custom-icons-menu '+item.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </template>
          <!-- 二级菜单 -->
          <template v-for="child in item.children">
            <el-submenu :index="child.path" :key="child.path" v-if="child.children&& !child.hidden" v-permissions="child.permissions">
              <template slot="title"><i :class="child.icon"></i>{{child.meta.title}}</template>
              <el-menu-item v-for="child2 in child.children" :index="child2.path" :key="child2.path" v-if="!child2.hidden" v-permissions="child2.permissions">
                <span slot="title">{{child2.meta.title}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-if="!child.children && !child.hidden" :index="child.path" :key="child.path"  v-permissions="child.permissions">
              <span slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item  v-if="!item.children && !item.hidden" :index="item.path" :key="'child'+item.path" v-permissions="item.permissions">
          <i :class=" 'custom-icons-menu '+item.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menus: [], // 菜单数据
      active: '', // 活动菜单
      appCount: 0 // 待处理数
    }
  },
  watch: {
    // 如果路由有变化
    '$route': function () {
      this.$store.commit('menuShow', true)
    }
  },
  mounted () {
    this.initLeftMenu()
  },
  methods: {
    // 初始化菜单
    initLeftMenu: function () {
      this.$router.options.routes[1].children.forEach((menu) => {
        let childSys = menu.path.split('/')
        if (!menu.hidden && (this.$store.state.childSys.type === childSys[1] || childSys[1] === 'error')) {
          this.menus.push(menu)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.scroll {
  height: 100%;
  position: relative;
}
.leftSolider {
  position: relative;
  height: 100%;
  overflow:auto;
  width: 237px;
}
.leftSolider::-webkit-scrollbar,
.leftSolider::-moz-scrollbar,{/*滚动条整体样式*/
    width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
.leftSolider::-webkit-scrollbar-thumb,
.leftSolider::-moz-scrollbar-thumb, {/*滚动条里面小方块*/
    border-radius: 8px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    background: #ccc;

  }
.leftSolider::-webkit-scrollbar-track,
.leftSolider::-moz-scrollbar-track, {/*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    border-radius: 8px;
    background: #EDEDED;
  }
</style>
