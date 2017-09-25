export default function printMe() {
    console.log('I get called from print.js!');
    console.log('updata22');
    //cosnole.log('I get called from print.js!'); // 故意写错console，然后生成一个错误
    console.log(_.join(['Hello', '333'], ' '));
}