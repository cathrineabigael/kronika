var $$ = Dom7;

var device = Framework7.getDevice();
var app = new Framework7({
  name: 'Kronika', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element

  id: 'io.framework7.myapp', // App bundle ID
  // App store
  store: store,
  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: device.cordova && !device.electron,
    scrollIntoViewCentered: device.cordova && !device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});

var trivia = ['Air murni memiliki pH sekitar 7', 'Lebah memiliki 2 sayap', 'Samudera Pasifik adalah samudera terbesar di dunia', 'Berlian adalah batu terkeras di dunia'
  , "Hiu sama sekali tidak memiliki tulang di tubuhnya", "Bulan memiliki 8 fase", "'Piano' memiliki arti 'untuk dimainkan dengan lembut'", "Gurita memiliki tiga buah hati",
  "Jerapah tidak memiliki pita suara", "Film Titanic dirilis pada tahun 1997"];

$$('#trivia').on('click', function () {
  var idx = Math.floor(Math.random() * 10) + 1;
  // app.dialog.alert(trivia[idx - 1]);
  app.dialog.create({
    title: 'Trivia',
    text: trivia[idx - 1],
    buttons: [
      {
        text: 'Wow!',
      },
    ],
    verticalButtons: true,
  }).open();
});

$$(document).on('page:afterin', function (e, page) {
  if (!localStorage.username) {
    page.router.navigate("/login");
  }
});

$$(document).on('page:init', function (e, page) {
  if (page.name == 'login') {
    //ketika login ya harus hapus username yg tersimpan sebelumnya
    localStorage.removeItem("username");
    $$('#btnsignin').on('click', function () {
      app.request.post("http://ubaya.fun/hybrid/160719015/login.php", {
        "user_id": $$('#username').val(),
        "user_password": $$('#password').val()
      }, function (data) { //kalau berhasil dia akan masuk ke sini
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == 'success') {
          localStorage.username = $$('#username').val();
          //dikembalikan lagi ke index
          app.dialog.alert("Selamat datang!")
          page.router.back('/');
        } else {
          app.dialog.alert("Nama pengguna atau sandi anda salah");
        }
      });
    });

    $$('#btnsignup').on('click', function () {
      // if ($$('#newpassword').val == $$('#newpassword2').val) {
      //   alert($$('#newpassword').val);
      //   alert($$('#newpassword2').val);
      localStorage.removeItem("username");

      app.request.post("http://ubaya.fun/hybrid/160719015/signup.php", {
        "fullname": $$('#newfullname').val(),
        "username": $$('#newusername').val(),
        "password": $$('#newpassword').val(),
        "password2": $$('#newpassword2').val()
      }, function (data) {
        var arr = JSON.parse(data);
        var result = arr['result'];
        if (result == 'success') {
          localStorage.username = $$('#username').val();

          app.dialog.alert("Berhasil membuat akun. Silahkan login!")
          $$('#batal')[0].click();
          page.router.navigate("/login");
        } else {
          app.dialog.alert(arr['message']);
        }
      });
    });

  } else if (page.name == 'category') {
    var id = page.router.currentRoute.params.id;
    if (id == "1") {
      $$('#title').html("Ekonomi")
    }
    else if (id == "2") {
      $$('#title').html("Politik")
    }
    if (id == "3") {
      $$('#title').html("Olahraga")
    }
    if (id == "4") {
      $$('#title').html("Gaya Hidup")
    }

    app.request.post(
      "http://ubaya.fun/hybrid/160719015/newscategory.php", { "id": id },
      function (data) {
        var arr = JSON.parse(data);
        var news = arr['data'];
        // app.dialog.alert(data);
        for (i = 0; i < news.length; i++) {
          $$("#category_content").append("<div class='card demo - card - header - pic'>" +
            "<div style = 'background-image:url(" + news[i]['cover_image'] + "); background-size:cover;height:200px;color: #333;'" +
            "class= 'card-header align-items-flex-end'><div style='background-color: rgba(51, 51, 51, 0.65); width:90%;padding-left:10px;'><h4 style='margin:0;opacity:100%;color:#f2f2f2;'>" + news[i]['title'] + "</h4></div></div >" +
            "<div class='card-content card-content-padding'>" +
            "<p class='date'>" + news[i]['date2'] + "</p>" +
            "<p style='text-align:justify;'>" + news[i]['shortenedcontent'] + "...</p>" +
            "</div>" +
            "<div class='card-footer'><a href='#' class='link' ><i class='icon f7-icons' id='icon_like' style='font-size:20px;color:#d1c120;'></i></a><a href='/detail/" + news[i]['news_id'] + "' class='link'>Selengkapnya</a></div>" +
            "<input type='hidden' name='idhidden' val='" + news[i]['news_id'] + "'>" +
            "</div > ");
        }
      }
    );

  } else if (page.name == "newsdetail") {
    var id = page.router.currentRoute.params.id;

    app.request.post(
      "http://ubaya.fun/hybrid/160719015/newsdetail.php", { "id": id },
      function (data) {
        var arr = JSON.parse(data);
        // app.dialog.alert(data);
        var news = arr['data'];
        $$('#title').html(news[0]['name']);
        $$("#detail_content").prepend("<div class='card demo - card - header - pic'>" +
          "<div style = 'background-image:url(" + news[0]['cover_image'] + "); background-size:cover;height:200px;color: #333;'" +
          "class= 'card-header align-items-flex-end'></div >" +
          "<div class='card-content card-content-padding'>" +
          // "<h2 style=''>" + news[0]['title'] + "</h2><p class='date' style='margin-top:-10px;'>" + news['author'][0]['firstname'] + " " + news['author'][0]['lastname'] + " <i class='icon f7-icons' style='font-size:7px;color:#1e2e61;'>hexagon_fill</i> " + news[0]['date2'] +
          "<h2 style=''>" + news[0]['title'] + "</h2><p class='date' style='margin-top:-10px;'>" + "<a class='sheet-open' href='#' data-sheet='.my-sheet-swipe-to-close'>" + news['author'][0]['firstname'] + " " + news['author'][0]['lastname'] + " </a><i class='icon f7-icons' style='font-size:7px;color:#1e2e61;'>hexagon_fill</i> " + news[0]['date2'] +
          "<br><br><p style='text-align:justify;'>" + news[0]['content'].replace(";;", "<br><br>") + "</p>" +
          "<br><h4 style='text-align:left;'>Tags</h4>" +
          "<div class='block' id='tag' style='margin-bottom:20px;'></div>" +
          "</div>" +
          "</div > ");

        var tags = arr['data']['tags'];
        for (i = 0; i < tags.length; i++) {
          $$("#tag").append("<div class='chip'><div class= 'chip-label'>" + tags[i]['name'] + "</div ></div> ");
        }

        $$('#author').append("<div class='row'>" +
          "<div class='col-15' style='padding-left:10px;'>" +
          "<img src='https://asset.kompas.com/data/2016/kolom/images/kolom_profil.jpg'" +
          "  style='width:90px;height:90px;border-radius:100%;' alt=''" +
          " class='elevation-demo elevation-3'>" +
          "</div>" +
          " <div class='col-70'>" +
          "    <h2 style='margin-top:0px;'>" + news['author'][0]['firstname'] + " " + news['author'][0]['lastname'] + "</h2>" +
          "    <p style='margin-top:-15px;'>" + news['author'][0]['email'] + "</p>" +
          "   <a class='' id='selengkapnya' href='/author/" + news['author'][0]['id'] + "'>Selengkapnya</a>" +
          "   <a class='link sheet-close' id='done' style='display:none;' href='#''>Done</a>" +
          "</div>" +
          "</div>");
      }
    );

    $$("body").on("click", "#selengkapnya", function () {
      $$('#done')[0].click();
    });

  } else if (page.name == "authordetail") {
    var id = page.router.currentRoute.params.id;
    app.request.post(
      "http://ubaya.fun/hybrid/160719015/authordetail.php", { "id": id },
      function (data) {
        var arr = JSON.parse(data);
        // app.dialog.alert(data);
        var author = arr['data'];

        $$('#author_name').html(author[0]['firstname'] + " " + author[0]['lastname']);
        $$('#email').html("<p>" + author[0]['email'] + "</p>");

        for (i = 0; i < author.length; i++) {
          $$("#article").append("<li>" +
            "<a href='/detail/" + author[i]['id'] + "' class='item-link item-content'>" +
            "<div class='item-media'>" +
            " <img src='" + author[i]['cover_image'] + "' style='background-size:cover;width:60px;height:60px;'/></div>" +
            " <div class='item-inner'>" +
            "<div class='item-title-row'>" +
            " <div class='item-text' style='color:#1e2e61;'>" + author[i]['title'] + "</div>" +
            " </div>" +
            "  <div class='item-subtitle' style='font-size:0.75em;'>" + author[i]['date2'] + "</div>" +
            " </div>" +
            "</a>" +
            "<hr style='width:90%;border:1px solid #f1f1f1;'></li>");
        }

      }
    );
  }

});

