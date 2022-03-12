//#region @notForNpm
//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
selector: 'app-json10-writer',
template: 'hello from json10-writer'
})
export class Json10WriterComponent implements OnInit {
constructor() { }

ngOnInit() { }
}

@NgModule({
imports: [],
exports: [Json10WriterComponent],
declarations: [Json10WriterComponent],
providers: [],
})
export class Json10WriterModule { }
//#endregion

//#region @backend
async function start(port: number)  {

}

export default start;

//#endregion

//#endregion