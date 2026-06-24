exports.sendMail = async (receiverEmail, subject, body) => {
  console.log("========== LOCAL EMAIL DISABLED ==========");
  console.log("To:", receiverEmail);
  console.log("Subject:", subject);
  console.log("Body:", body);
  console.log("==========================================");

  return true;
};