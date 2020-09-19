#!/usr/bin/env node

/**
 * Sending email if we have some data status processed longer than expected.
 * Setting nodemailer module and sending info.
 *
 * @param {*} content html content for nodemailer's html(key)
 * @param {*} productType product of report-tracking system
 * @param {*} flag to determin whether table content is empty. If it's true, it represents that data details need to send mail to related person.
 * @returns
 */
function sendMail(content, flag, mailListFlag, groupMail) {
  if (flag == false) {
    return;
  }
  const subjectTitle = "每日冰箱查核警示";
  //引用 nodemailer
  const nodemailer = require("nodemailer");

  let sendList = [
    "tklin@sofivagenomics.com.tw",
    "yichu@sofivagenomics.com.tw",
    "tsuling@sofivagenomics.com.tw",
    "tehyang.hwa@sofivagenomics.com.tw",
    "bmi.cfc@sofivagenomics.com.tw"
  ];

  if (mailListFlag === "secondary") {
    sendList = groupMail;
  }
  //宣告發信物件
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "bmi@sofivagenomics.com.tw",
      pass: "sofiva6615"
    }
    // service: 'Gmail',
    // auth: {
    //   user: 'sofiva.bmi@gmail.com',
    //   pass: 'zabvtgxrhahvjjqh'
    // }
  });

  let options = {
    //寄件者
    from: "bmi@sofivagenomics.com.tw",
    //收件者
    to: sendList,
    //副本
    // cc: 'bmi.cfc@sofivagenomics.com.tw',
    //密件副本
    // bcc: "bmi.cfc@sofivagenomics.com.tw",
    //主旨
    subject: subjectTitle, // Subject line
    //純文字
    text: "", // plaintext body
    //嵌入 html 的內文
    html: content
  };

  //發送信件方法
  transporter.sendMail(options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("訊息發送: " + info.response);
    }
  });
}

/**
 *  Subject: To write total mail content in a variable
 *  Method: Useing += to contiue the html content string. If flag is
 *          true represents uncompleted data exists and need to send
 *          to related person. we also have template like ./test.html
 *          to test the mail content style is what we want.
 *
 * @param {*} data
 * @returns
 */
function writeMailContent(data, mailListFlag, groupMail) {
  // console.log("data: " + JSON.stringify(data));
  // console.log(data);
  const tempUrl = "http://192.168.116.232.xip.io/TMSS2/#/";
  let flag = 0;
  flag = data.length > 0 ? 1 : 0;
  let content = `
    <h2>TMSS Signature Reminder Notify</h2>
    <p>The status of signature was unsigned in 3 days. Click<a href="${tempUrl}"> here</a> to check status.</p>
    <p>The information is summerized below:</p>
    <table style = "border-collapse: collapse; width:800px;">
      <col width = "15%">
      <col width = "10%">
      <col width = "10%">
      <col width = "10%">
      <col width = "10%">
      <col width = "10%">
      <col width = "15%">
      <col width = "20%">

        <tr>
          <th style = "border-bottom: 1px solid #ddd; padding:10px 0px; background-color: #6bc541;"> RefID </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Floor </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> RefType </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Owner </th>
          <th style = "border-bottom: 1px solid #ddd; background-color: #6bc541;"> Date </th>
        </tr>`;

  for (let index = 0; index < data.length; index++) {
    content += `<tr>
            <td align='center' style='border-bottom: 1px solid #ddd; padding:10px 0px;'>${data[index].RefID}</td>
            <td align='center' style='border-bottom: 1px solid #ddd;'>${data[index].Floor}</td>
            <td align='center' style='border-bottom: 1px solid #ddd;'>${data[index].RefType}</td>
            <td align='center' style='border-bottom: 1px solid #ddd;'>${data[index].Owner}</td>
            <td align='center' style='border-bottom: 1px solid #ddd;'>${data[index].TempDate}</td>
          </tr>`;
  }

  content += `\n</table>`;
  content += `<div  style="padding-top: 100px; display:block">
                  <br>
                  <span>慧智基因</span>
                  <br>
                  <span>姜權芳 Chuan-Fang Chiang</span>
                  <br>
                  <span>生物資訊分析師</span>
                  <br>
                  <span>地址:台北市中正區寶慶路27號5樓</span>
                  <br>
                  <span>電話:(02)2382-6615 EXT.6503</span>
            </div>`;
  // console.log(data.el);
  // console.log("Content" + content, flag);
  sendMail(content, flag, mailListFlag, groupMail);
  // console.log(data);
  return content, flag;
}

const axios = require("axios");
const cron = require("node-cron");

// let alertCompareData = {};
// let sampleRun;
// const fs = require("fs");
// const writeFile = (filename, content) => {
//   fs.writeFile(filename, content, () => {});
// };
// const date = new Date().toISOString().slice(0, 10);
const url = "http://192.168.116.232/tms_rest/signReminder.php";
// const recordPath = `/opt/lampp/htdocs/TMSS2/nodeJS/records${date}.txt`;
// console.log(recordPath);
cron.schedule("0 12 * * *", function() {
  let alertData = [];
  let mailList = [];
  axios
    .get(`${url}`)
    .then(res => {
      alertData = [];
      mailList = [];
      const data = res.data;
      // console.log(data);
      data.forEach(el => {
        alertData.push({
          NodeName: el.NodeName,
          RefID: el.RefID,
          Floor: el.Floor,
          RefType: el.RefType,
          Accept_lo: el.Accept_lo,
          Accept_hi: el.Accept_hi,
          Owner: el.Owner,
          Email: el.Email,
          TempDate: el.Date
        });
        mailList.push(el.Email);
        // console.log(el.NodeName, el.AvgTemp);
      });
      mailList = [...new Set(mailList)];
      writeMailContent(alertData, "primary");

      mailList.forEach(el => {
        let tempAlert = [];
        alertData.forEach(item => {
          if (item.Email === el) {
            tempAlert.push({
              NodeName: item.NodeName,
              RefID: item.RefID,
              Floor: item.Floor,
              RefType: item.RefType,
              Accept_lo: item.Accept_lo,
              Accept_hi: item.Accept_hi,
              Owner: item.Owner,
              Email: item.Email,
              TempDate: item.Date
            });
          }
        });
        writeMailContent(tempAlert, "secondary", el);
      });
    })
    .catch(err => {
      console.log(err);
    });
});
