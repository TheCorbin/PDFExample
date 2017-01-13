import { Component } from '@angular/core';
import { InAppBrowser, File } from 'ionic-native';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {



  constructor(public navCtrl: NavController) {

  }

  open_pdf( ){
    let browser = new InAppBrowser('../assets/pdfs/pdf1.pdf', '_blank', 'location=yes, enableViewportScale=yes');
  //   // browser.insertCss({
  //   //   "code": "body { height: 50%; }"
  //   // });
  //
  //   // window.things = "foo";
  //   setTimeout(() => {
  //     browser.executeScript({code: "alert(window.things);"});
  //
  //   }, 2000)
  //   browser.show();
  // }

    (<any>window).plugins.SitewaertsDocumentViewer.viewDocument(
      '../assets/pdfs/pdf1.pdf',
    )
  }
}
