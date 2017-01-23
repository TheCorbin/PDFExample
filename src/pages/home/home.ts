import { Component } from '@angular/core';
import { InAppBrowser, File, Transfer } from 'ionic-native';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { ThemeableBrowser } from 'ionic-native';
import { PDFModel } from '../../models/pdf-model';
declare var cordova: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  storageDirectory: string = '';
  pdf: PDFModel;

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
    })

  }

  open_pdf( ){
    // let browser = new InAppBrowser('../assets/pdfs/pdf1.pdf', '_blank', 'location=yes, enableViewportScale=yes');
    // browser.show();

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


    cordova.plugins.SitewaertsDocumentViewer.viewDocument( this.pdf.location, 'application/pdf', options, this.onShow, this.onClose, this.onMissingApp, this.onError);
  }

  check_pdf(){
    var options;
    cordova.plugins.SitewaertsDocumentViewer.canViewDocument( this.pdf.location, 'application/pdf', options, this.onPossible, this.onMissingApp, this.onImpossible, this.onError);
  }

  onShow(){
    console.log('document shown');
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

  download_pdf(){
    this.platform.ready().then(() => {

      const fileTransfer = new Transfer();
      const imageLocation ='http://www.axmag.com/download/pdfurl-guide.pdf';

      fileTransfer.download(imageLocation, this.storageDirectory + "pdf.pdf").then((entry) => {

        console.log(entry);

        const alertSuccess = this.alertCtrl.create({
          title: 'Download Succeeded!',
          subTitle: 'pdf.pdf was successfully download to:' + entry.toURL(),
          buttons: ['OK']
        });
        alertSuccess.present();

        let temp = new PDFModel( "Hamburger", entry.toURL() );
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
  }

  // open_themeable_pdf(){
  //     cordova.ThemeableBrowser.open(this.pdf.location, '_blank', {
  //     statusbar: {
  //         color: '#ffffffff'
  //     },
  //     toolbar: {
  //         height: 44,
  //         color: '#f0f0f0ff'
  //     },
  //     title: {
  //         color: '#003264ff',
  //         showPageTitle: false
  //     },
  //     backButton: {
  //         wwwimage: 'images/bookmark.png',
  //         wwwimagePressed: 'images/bookmark.png',
  //         align: 'left',
  //         event: 'backPressed'
  //     },
  //     forwardButton: {
  //         wwwimage: 'assets/images/disembodied_princess.png',
  //         wwwimagePressed: 'assets/images/disembodied_princess.png',
  //         align: 'left',
  //         event: 'forwardPressed'
  //     },
  //     closeButton: {
  //         image: 'close',
  //         imagePressed: 'close_pressed',
  //         align: 'left',
  //         event: 'closePressed'
  //     },
  //     customButtons: [
  //         {
  //             image: 'share',
  //             imagePressed: 'share_pressed',
  //             align: 'right',
  //             event: 'sharePressed'
  //         }
  //     ],
  //     menu: {
  //         image: 'menu',
  //         imagePressed: 'menu_pressed',
  //         title: 'Test',
  //         cancel: 'Cancel',
  //         align: 'right',
  //         items: [
  //             {
  //                 event: 'helloPressed',
  //                 label: 'Hello World!'
  //             },
  //             {
  //                 event: 'testPressed',
  //                 label: 'Test!'
  //             }
  //         ]
  //     },
  //     backButtonCanClose: true
  //   }).addEventListener('backPressed', function(e) {
  //                              //alert('back pressed');
  //   }).addEventListener('openWith',function(e){
  //     $cordovaFileOpener2.open(
  //                                  vm.pdfURI,
  //                                  'application/pdf'
  //                              ).then(function() {
  //                                    // Success!
  //                              }, function(error) {
  //                                  $cordovaDialogs.alert('Ha ocurrido un error al abrir el documento : '+error, 'Error', 'Aceptar')
  //                                    // An error occurred. Show a message to the user
  //                              });
  //                          })
  // }
}
