<template>
  <div class="category">
    <van-tree-select
      height="80vh"
      :items="oneCategoryList"
      :main-active-index.sync="active"
      @click-nav="navHandle"
    >
      <!-- 二级分类 -->
      <template #content>
        <div
          class="category_sencond"
          v-for="item in twoCategoryList"
          :key="item.id"
        >
          <van-image width="4rem" :src="item.brandLogo" />
          <p>{{ item.brandName }}</p>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      items: [{ text: "分组 1" }, { text: "分组 2" }]
    };
  },
  methods: {
    //点击左侧一级分类触发改方法
    //index 点击左侧索引
    async navHandle(index) {
      console.log(index);
      //点击左侧项的id
      this.$router.replace(`/category?active=${index}`);
      let id = this.oneCategoryList[index]["id"];
      //加载二级分类
      const { twoCategoryList } = await this.$api.TwoCategory(id);
      this.twoCategoryList = twoCategoryList;
    }
  },
  async asyncData({ $api, query }) {
    let active = query.active || 0;
    let { oneCategoryList = [] } = await $api.OneCategory();
    //判断数据正常返回
    if (!oneCategoryList.length) {
      return;
    }
    // 按照vant 组件对数据的要求，所以我们需要对返回的数据进行加工处理
    oneCategoryList = oneCategoryList.map(item => {
      return {
        text: item.categoryName,
        ...item
      };
    });
    // 加载二级分类
    const { twoCategoryList } = await $api.TwoCategory(
      oneCategoryList[active]["id"]
    );
    return {
      active,
      oneCategoryList,
      twoCategoryList
    };
  }
};
</script>

<style>
.category_sencond {
  float: left;
  text-align: center;
}
</style>
