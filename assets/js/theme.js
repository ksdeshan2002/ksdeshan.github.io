const toggle=document.querySelector(".theme-toggle");

const currentTheme=localStorage.getItem("theme");

if(currentTheme){

    document.documentElement.setAttribute("data-theme",currentTheme);

}

toggle?.addEventListener("click",()=>{

    let theme=document.documentElement.getAttribute("data-theme");

    if(theme==="dark"){

        theme="light";

    }else{

        theme="dark";

    }

    document.documentElement.setAttribute("data-theme",theme);

    localStorage.setItem("theme",theme);

});