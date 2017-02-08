import { Component } from '@angular/core';
import { InAppBrowser, File, Transfer } from 'ionic-native';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { ThemeableBrowser } from 'ionic-native';
import { PDFModel } from '../../models/pdf-model';
import { PdfDisplayPage } from '../pdf-display/pdf-display';
// import  AndroidNativePdfViewer  from 'AndroidNativePdfViewer';
declare var cordova: any;
declare var AndroidNativePdfViewer: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  static readonly googleUrlPrefix = 'https://docs.google.com/gview?embedded=true&url=';
  storageDirectory: string = '';
  pdf: PDFModel;
  OnlineToggle: boolean;
  onlineLocation ='http://www.axmag.com/download/pdfurl-guide.pdf';

  constructor(public navCtrl: NavController, public platform:Platform, public alertCtrl: AlertController) {

    this.platform.ready().then(() => {
      if(!this.platform.is('cordova')){
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        return false;
      }

      this.platform.ready().then(() => {

        const fileTransfer = new Transfer();
        console.log(this.storageDirectory);
        fileTransfer.download(this.onlineLocation, this.storageDirectory + "pdf.pdf").then((entry) => {
          this.OnlineToggle = false;

          // const alertSuccess = this.alertCtrl.create({
          //   title: 'Download Succeeded!',
          //   subTitle: 'pdf.pdf was successfully download to:' + entry.toURL(),
          //   buttons: ['OK']
          // });
          // alertSuccess.present();

          let temp = new PDFModel( "Document", entry.toURL() );
          console.log(temp.location + " location!");
          console.log(temp.title + " title!")
          this.pdf = temp;

        }, (error) => {
          const alertFailure = this.alertCtrl.create({
            title: 'Download failed!',
            subTitle: '${image} was not successfully downloaded. Error code: ${error.code}',
            buttons: ['Ok']
          });
          alertFailure.present();
        });
      });
    })
  }

  open_siteweartspdf( ){
    //

    var options = {
      "title": "pdf",
      "documentView" : {
        "closeLabel" : "Close Document"
      },
      "navigationView" : {
        "closeLabel" : "Close Navigation"
      },
      "openwith" : {
        "enabled": "true"
      },
      "save" : {
        "enabled" : "true"
      },
      // "print" : {
      //   "enabled" : "true"
      // },
      // "bookmarks" : {
      //   "enabled" : "true"
      // },
      "search" : {
        "enabled" : "true"
      },
      "email" : {
        "enabled" : "true"
      }
    }

    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    if(this.platform.is('ios')) {

      if (this.OnlineToggle) {
        const alertFailure = this.alertCtrl.create({
          title: 'Not Supported',
          subTitle: 'Sitewaerts Document Viewer Does not support online viewing' ,buttons: ['Ok']
        });
        alertFailure.present();
      } else {
        cordova.plugins.SitewaertsDocumentViewer.viewDocument(tempLocation, 'application/pdf', options, this.onShow(tempLocation), this.onClose, this.onMissingApp, this.onError);
      }
    } else if(this.platform.is('android')) {

      const alertFailure = this.alertCtrl.create({
        title: 'Problem!',
        subTitle: 'The Document Viewer on Android throws to another app because of copyright issues.' ,buttons: ['Ok']
      });
      alertFailure.present();
    }

  }

  onShow(location){
    console.log('Showing file at:' + location);
  }

  onClose(){
    console.log('document closed');
  }

  onPossible(){
    console.log("Document can be shown");
  }

  onMissingApp(appId, installer){
    if(confirm("Do you want to install the free PDF Viwer App" + appId + " for Android?")){
      installer();
    }
  }

  onImpossible(){
    console.log('Document can not be shown');
  }

  onError(error){
    console.log(error);
    console.log("ERROR: CANNOT SHOW DOCUMENT");
  }

  open_inAppBrowser(){
    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    if(this.platform.is('ios')) {
      let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
      browser.show();

    } else if(this.platform.is('android')) {

      if(this.OnlineToggle){
        tempLocation = HomePage.googleUrlPrefix + encodeURIComponent(tempLocation);

        let browser = new InAppBrowser(tempLocation, '_blank', 'location=yes, enableViewportScale=yes');
        browser.show();

      } else {
        const alertFailure = this.alertCtrl.create({
          title: 'Problem!',
          subTitle: 'InAppBrowser can\'t open offline PDF\'s on an Android device' ,buttons: ['Ok']
        });
        alertFailure.present();
      }
    }
  }

  open_themeable_pdf(){
    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    if(this.platform.is('ios')) {

      this.themeableBrowser(tempLocation);

    } else if(this.platform.is('android')) {

      if(this.OnlineToggle){

        this.themeableBrowser(HomePage.googleUrlPrefix + encodeURIComponent(tempLocation));

      } else {
        const alertFailure = this.alertCtrl.create({
          title: 'Problem!',
          subTitle: 'ThemeableBrowser can\'t open offline PDF\'s on an Android device' ,buttons: ['Ok']
        });
        alertFailure.present();
      }
    }
  }

  themeableBrowser(location){
    const baseConfig = {
      toolbar: {
        height: 44,
        color: '#004a8b'
      },
      closeButton: {
        wwwImage: 'assets/icon/back_small.png',
        wwwImageDensity: 2,
        align: 'left',
        event: 'closePressed'
      },
      menu: {
        wwwImage: 'assets/icon/more_small.png',
        wwwImageDensity: 2,
        align: 'right',
        cancel: 'Cancel',
        items: [
          {
            event: 'helloPressed',
            label: 'Hello World!'
          },
          {
            event: 'locationPressed',
            label: 'Location of PDF'
          },
        ]

      },
      backButtonCanClose: false
    }

    let browser = cordova.ThemeableBrowser.open(location, '_blank', baseConfig);

    browser.addEventListener('backPressed', function(e) {
      alert('back pressed');
    });

    browser.addEventListener('helloPressed', function(e) {
      alert('hello pressed');
    });

    browser.addEventListener('locationPressed', function(e) {
      alert(location);
    });

    browser.addEventListener(cordova.ThemeableBrowser.EVT_ERR, function(e) {
      console.error(e.message);
    });

    browser.addEventListener(cordova.ThemeableBrowser.EVT_WRN, function(e) {
      console.log(e.message);
    });
  }

  openAndroidPDF(){
    let tempLocation = this.OnlineToggle ? this.onlineLocation : this.pdf.location;

    var options = {
      headerColor:"#000000",
      showScroll:true
    }

    if(this.platform.is('ios')) {
      const alertFailure = this.alertCtrl.create({
        title: 'Problem!',
        subTitle: 'The Android Document Viewer doesn\'t work on iOS.  Shocking.' ,buttons: ['Ok']
      });
      alertFailure.present();
    } else if(this.platform.is('android')) {
      AndroidNativePdfViewer.openPdfUrl(tempLocation, this.pdf.title, options,
        function(success){
          console.log(tempLocation)
        }, function(error){
          console.log("It didn't work!")
        });
    }
  }
}
