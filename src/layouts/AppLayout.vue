<template>

  <div style="text-align: center;font-size: 18px;" class="sign">
    <h1 style="margin-bottom:80px;">西城招聘系统</h1>
    <a type="primary" @click="$router.push('/candidate')" >应聘岗位</a>
    <a-divider type="vertical" />
    <a type="primary" @click="$router.push('/recruiter')">招聘入口</a>
    <a-divider type="vertical" />
    <a type="primary" @click="$router.push('/admin')">管理员入口</a>
  </div>
</template>

  <script>
  export default {
   
  }
  </script>

<style>
  body{
    background-image: url('https://api.ixiaowai.cn/gqapi/gqapi.php');
    overflow: hidden;
    background-size: 100%;
    border-image-repeat: no-repeat;
  }
  .sign{
    position: relative;
    background-color: rgba(255, 255, 255, 0.7);
    margin-top: 240px;
    text-align: center;
    font-size: 18px;
  }

</style>
