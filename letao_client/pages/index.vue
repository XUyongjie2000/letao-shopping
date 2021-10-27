<template>
  <div class="home">
    <!-- 1.轮播图组件 -->
    <IndexCarousel :swiperList="swiperList" />
    <!-- 2.宫格组件 -->
    <IndexGridList :gridlist="gridlist" />
    <!-- 3.活动组件 -->
    <IndexActive />
    <!-- 4.品牌组件 -->
    <IndexBrand />
    <!-- 5.运动专区 -->
    <IndexSports :sports="sports" />
  </div>
</template>

<script>
export default {
  async asyncData({ $api }) {
    // const { swiperList } = await $axios.$get("/banners");
    // console.log(swiperList, "swiperList");
    //轮播图接口
    // const { swiperList } = await $axios.$get("/banners");
    // const { gridlist } = await $axios.$get("/gridlist");
    // const { sports } = await $axios.$get("/sports");
    // const { swiperList } = await $request.$get("/banners");
    // const { gridlist } = await $request.$get("/gridlist");
    // const { sports } = await $request.$get("/sports");
    // console.log(swiperList, "swiperList");

    // const { swiperList } = await $api.IndexBanners(); // 轮播图
    // const { gridlist } = await $api.IndexGridList(); // 宫格数据
    // const { sports } = await $api.IndexSport(); // 运动专区数据
    const [{ swiperList }, { gridlist }, { sports }] = await Promise.all([
      $api.IndexBanners(),
      $api.IndexGridList(),
      $api.IndexSport()
    ]);
    return {
      swiperList,
      gridlist,
      sports
    };
  }
};
</script>

<style></style>
