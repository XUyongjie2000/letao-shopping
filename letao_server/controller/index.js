//宫格数据的业务控制
module.exports.gridlist = async (ctx) => {
  //返回给客户端
  ctx.body = {
    status: 200,
    gridlist: [
      {
        id: 1,
        img_src: "images/nav1.png",
      },
      {
        id: 2,
        img_src: "images/nav2.png",
      },
      {
        id: 3,
        img_src: "images/nav3.png",
      },
      {
        id: 4,
        img_src: "images/nav4.png",
      },
      {
        id: 5,
        img_src: "images/nav5.png",
      },
      {
        id: 6,
        img_src: "images/nav6.png",
      },
    ],
  };
};

//首页轮播图
module.exports.banners = async (ctx) => {
  ctx.body = {
    status: 200,
    swiperList: [
      {
        id: 1,
        img_src: "images/banners1.png",
      },
      {
        id: 2,
        img_src: "images/banners2.png",
      },
      {
        id: 3,
        img_src: "images/banners3.png",
      },
      {
        id: 4,
        img_src: "images/banners4.png",
      },
      {
        id: 5,
        img_src: "images/banners5.png",
      },
      {
        id: 6,
        img_src: "images/banners6.png",
      },
    ],
  };
};
//首页运动专区
module.exports.sports = async (ctx) => {
  ctx.body = {
    status: 200,
    sports: [
      {
        name: "adidas阿迪达斯 男式 场下休闲篮球鞋S83700",
        img: "/images/product.jpg",
        price: 1.0,
        oldPrice: 888.0,
      },
      {
        name: "FORUM 84 LOW 新款低帮经典运动鞋",
        img: "/images/product.jpg",
        price: 1.0,
        oldPrice: 899.0,
      },
      {
        name: "adidas阿迪达斯 男式 场下休闲篮球鞋S83700",
        img: "/images/product.jpg",
        price: 1.0,
        oldPrice: 888.0,
      },
      {
        name: "adidas阿迪达斯 男式 场下休闲篮球鞋S83700",
        img: "/images/product.jpg",
        price: 1.0,
        oldPrice: 888.0,
      },
    ],
  };
};
