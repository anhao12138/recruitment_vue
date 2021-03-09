export function fotmatUserType(userType) {
  switch (userType) {
    case "APPLICANT":
      return "应聘人员";
    case "RECRUITER":
      return "招聘人员";
    case "ADMIN":
      return "管理员";
    default:
      return "其他";
  }
}
