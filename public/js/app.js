function mailcall(custName,custEmail,custPhone){
	$.ajax({
      url: 'https://www.beckme.in/request.php',
      data:
      {
        name : custName,
		email : custEmail,
		phoneno : custPhone
      },
      error: function(error) {
      //console.log(JSON.stringify(error));
        },
      success: function(data) {
       // console.log("worked");
       },
      type: 'POST'
	});
	}

function confirm(){
  var checkname=checkName();
  var checkno=checkInp();
  var checkemail=checkEmail();
  if(checkname)
  {
    if(checkno)
    {
      if(checkemail)
      {
			var invitename = document.getElementById("name").value ;
			var inviteemail = document.getElementById("email").value+" web request";
		  var invitephn = document.getElementById("number").value;
		  mailcall(invitename,inviteemail,invitephn);
		  alert("Thanks for contacting us. We will get back to you shortly");
      location.reload();
}
else
{
alert("Please enter a valid email address");
}
}
else
{
alert("Please enter a valid 10 digit number");
}
}
else
{
  alert("Please fill all required fields");
}
return false;
} 
function checkInp()
{
  
    var x=document.getElementById("number").value;
  
    var regex=/^[0-9]+$/;
    var actual=10;
   if (isNaN(x) ) 
    {
    return false;
    }
    else if((x.length <10) || (x.length >10))
    {
    return false;
    }
    else return true;
      
}
function checkName()
{
if(document.getElementById("name").value == "")
  {
    return false;
  }
    else return true;
}
function checkEmail()
{
if((document.getElementById("email").value.indexOf('.') == -1)||(document.getElementById("email").value.indexOf('@') == -1))
  {
    return false;
  }
    else return true;
}




