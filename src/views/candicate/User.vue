<template>
  <a-card title="个人信息">
    <a-form :form="userForm" @submit="handleUpdate">
      <!-- <a-form-item label="ID" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.id" disabled />
      </a-form-item> -->
      <a-form-item label="账号" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.username" disabled />
      </a-form-item>
      <a-form-item label="角色" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="fotmatUserType" disabled />
      </a-form-item>
      <a-form-item label="性别" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-radio-group
          name="radioGroup"
          :defaultValue="user.gender"
          v-decorator="[
          'gender',
          { initialValue:user.gender,rules: [{ required: true, message: 'Please input your Gender!' }] },
        ]"
        >
          <a-radio :value="0">女</a-radio>
          <a-radio :value="1">男</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="年龄" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input
          placeholder="Age"
          v-decorator="[
          'age',
          { initialValue:user.age,rules: [{ required: true, message: 'Please input your Age!' }] },
        ]"
        />
      </a-form-item>
      <a-form-item label="Phone" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input
          placeholder="Phone"
          v-decorator="[
          'phone',
          { initialValue:user.phone,rules: [{ required: true, message: 'Please input your Phone!' }] },
        ]"
        />
      </a-form-item>
      <a-form-item label="邮箱" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input
          placeholder="Mail"
          v-decorator="[
          'mail',
          { initialValue:user.mail,rules: [{ required: true,type: 'email', message: 'Please input valid Mail!' }] },
        ]"
        />
      </a-form-item>
      <!-- <a-form-item label="简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'introduction',
          { initialValue:user.introduction },
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>-->
      <a-form-item label="教育经历" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'education',
          { initialValue:user.education ,rules: [{ required: true, message: 'Please input your education!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="工作经验" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'workExperience',
          { initialValue:user.workExperience ,rules: [{ required: true, message: 'Please input your workExperience!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="项目经验" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'projectExperience',
          { initialValue:user.projectExperience ,rules: [{ required: true, message: 'Please input your projectExperience!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="语言能力" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'language',
          { initialValue:user.language ,rules: [{ required: true, message: 'Please input your language!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="专业技能" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'professionalSkill',
          { initialValue:user.professionalSkill ,rules: [{ required: true, message: 'Please input your professionalSkill!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="自我评价" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-textarea
          v-decorator="[
          'selfEvaluation',
          { initialValue:user.selfEvaluation ,rules: [{ required: true, message: 'Please input your selfEvaluation!' }]},
        ]"
          :autosize="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>

      <a-form-item label="注册时间" :label-col="{ span: 2 }" :wrapper-col="{ span: 6 }">
        <a-input :value="user.createTime" disabled />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">更新信息</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import * as userApi from "../../api/candidateUser";
import { fotmatUserType } from "../../util/appUtil";

export default {
  data() {
    return {
      userForm: this.$form.createForm(this),
      user: {}
    };
  },
  mounted() {
    userApi.info.r().then(resp => {
      if (resp.data.code === "000000") {
        this.user = resp.data.data;
      }
    });
  },
  computed: {
    fotmatUserType() {
      return fotmatUserType(this.user.userType);
    }
  },
  methods: {
    handleUpdate(e) {
      e.preventDefault();
      this.userForm.validateFields((err, values) => {
        if (!err) {
          let updateVo = values;
          userApi.updateUser.r(updateVo).then(resp => {
            if (resp.data.code === "000000") {
              this.$message.info("更新成功!");
            }
          });
        }
      });
    }
  }
};
</script>