import Vue from "vue";
import Router from "vue-router";
import { getToken } from "../src/util/token";

Vue.use(Router);

// 不作为Main组件的子页面展示的页面单独写，如下
// const loginRouter = {
//   path: "/login",
//   name: "login",
//   meta: {
//     title: "登录"
//   },
//   component: () => import("./views/login/Login.vue")
// };

const page404 = {
    path: "*",
    name: "error_404",
    meta: {
        title: "404-页面不存在"
    },
    component: () =>
        import ("../src/views/common/Error404.vue")
};

const appRouter = {
    path: "/",
    component: () =>
        import ("../src/layouts/AppLayout.vue")
};
const cand = () =>
    import ('@/views/candicate/CandidateLogin.vue')
const candidateRouter = {
    path: "/candidate",
    component: () =>
        import ("../src/layouts/CandidateLayout.vue"),
    children: [
        { path: "/", redirect: "/candidate/job" },
        {
            path: "login",
            name: "candidateLogin",
            meta: {
                title: "登录"
            },
            component: () =>
                import ("../src/views/candicate/CandidateLogin.vue")

        },
        {
            path: "job",
            name: "candidateJob",
            meta: {
                title: "岗位浏览",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/candicate/Job.vue")
        },
        {
            path: "recommendJob",
            name: "recommendJob",
            meta: {
                title: "推荐岗位",
                requireLogin: true
            },
            component: cand
        },
        {
            path: "history",
            name: "candidateHistory",
            meta: {
                title: "应聘记录",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/candicate/History.vue")
        },
        {
            path: "user",
            name: "candidateUser",
            meta: {
                title: "个人中心",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/candicate/User.vue")
        }
    ]
};

const recruiterRouter = {
    path: "/recruiter",
    component: () =>
        import ("../src/layouts/RecruiterLayout.vue"),
    children: [
        { path: "/", redirect: "/recruiter/job" },
        {
            path: "login",
            name: "recruiterLogin",
            meta: {
                title: "登录"
            },
            component: () =>
                import ("../src/views/recruiter/RecruiterLogin.vue")
        },
        {
            path: "job",
            name: "recruiterJob",
            meta: {
                title: "招聘信息",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/recruiter/Job.vue")
        },
        {
            path: "history",
            name: "recruiterHistory",
            meta: {
                title: "招聘记录",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/recruiter/History.vue")
        },
        {
            path: "user",
            name: "recruiterUser",
            meta: {
                title: "个人中心",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/recruiter/User.vue")
        }
    ]
};

const adminRouter = {
    path: "/admin",
    component: () =>
        import ("../src/layouts/AdminLayout.vue"),
    children: [
        { path: "/", redirect: "/admin/job" },
        {
            path: "login",
            name: "adminLogin",
            meta: {
                title: "登录"
            },
            component: () =>
                import ("../src/views/admin/AdminLogin.vue")
        },
        {
            path: "job",
            name: "adminJob",
            meta: {
                title: "招聘审核",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/admin/Job.vue")
        },
        {
            path: "candidate",
            name: "candidateManage",
            meta: {
                title: "应聘人员管理",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/admin/Candidate.vue")
        },
        {
            path: "recruiter",
            name: "recruiterManage",
            meta: {
                title: "招聘企业管理",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/admin/Recruiter.vue")
        },
        {
            path: "user",
            name: "adminUser",
            meta: {
                title: "个人中心",
                requireLogin: true
            },
            component: () =>
                import ("../src/views/admin/User.vue")
        }
    ]
};

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // loginRouter,
        appRouter,
        candidateRouter,
        recruiterRouter,
        adminRouter,
        page404
    ]
});

router.beforeEach((to, from, next) => {
    //设置页面标题
    let routeName = to.meta.title || to.name;

    if (to.fullPath.startsWith("/candidate/")) {
        window.document.title =
            "招聘系统[应聘]" + (routeName ? " - " + routeName : "");
    } else if (to.fullPath.startsWith("/recruiter/")) {
        window.document.title =
            "招聘系统[招聘]" + (routeName ? " - " + routeName : "");
    } else if (to.fullPath.startsWith("/admin/")) {
        window.document.title =
            "招聘系统[后台管理]" + (routeName ? " - " + routeName : "");
    } else {
        window.document.title = "招聘系统" + (routeName ? " - " + routeName : "");
    }

    if (to.meta.requireLogin) {
        // 判断该路由是否需要登录权限
        if (to.fullPath.startsWith("/candidate/")) {
            if (getToken("x-auth-token-candidate")) {
                // 获取当前的token是否存在
                next();
            } else {
                next({
                    path: "/candidate/login",
                    query: {
                        redirect: to.fullPath
                    }
                });
            }
        }
        if (to.fullPath.startsWith("/recruiter/")) {
            if (getToken("x-auth-token-recruiter")) {
                // 获取当前的token是否存在
                next();
            } else {
                next({
                    path: "/recruiter/login",
                    query: {
                        redirect: to.fullPath
                    }
                });
            }
        }
        if (to.fullPath.startsWith("/admin/")) {
            if (getToken("x-auth-token-admin")) {
                // 获取当前的token是否存在
                next();
            } else {
                next({
                    path: "/admin/login",
                    query: {
                        redirect: to.fullPath
                    }
                });
            }
        }
    } else {
        next();
    }
});
/**
 * 判断是否为移动设备，是，则跳转到移动端的路径
 */
router.beforeEach((to, from, next) => {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        window.location.href = '/m_index.html#/'
        return
    }
    next()
})
export default router;