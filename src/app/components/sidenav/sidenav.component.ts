import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CdkScrollable} from '@angular/cdk/overlay';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, AfterViewInit  {
  elements: [];
  scrollToElement: string;
  currentScroll: number;

  @ViewChild('sidenavcontent', {static: false}) scrollable: CdkScrollable;
  @ViewChild('sidenav', {static: false}) sidenav: ElementRef;
  constructor(private elem: ElementRef) {
  }

  ngOnInit() {
    this.elements = this.elem.nativeElement.querySelectorAll('.sidenav-content h2');
  }

  ngAfterViewInit() {
    this.scrollable.elementScrolled().subscribe(() => {
      this.onElementScrolled();
    });
    this.onElementScrolled();
  }

  onTocClick(sectionId) {
    const newActiveElement = this.elem.nativeElement.querySelector(`#${sectionId}`);
    this.scrollToElement = sectionId;
    this.scrollable.scrollTo({top: newActiveElement.offsetTop});
    this.setCurrentSelection(sectionId);
  }

  setCurrentSelection(elementId) {
    const oldActiveElement = this.elem.nativeElement.querySelector(`.active`);
    if (oldActiveElement) {
      oldActiveElement.classList.remove('active');
    }
    const tocID = `#toc-${elementId}`;
    const activeElement = this.elem.nativeElement.querySelector(tocID);
    activeElement.classList.add('active');
    const sidenav = this.elem.nativeElement.querySelector('.mat-drawer-inner-container');
    const scrollTop = activeElement.offsetTop - sidenav.offsetTop;
    sidenav.scrollTo({top: scrollTop});
  }

  onElementScrolled() {
    if (this.scrollToElement) {
      // Prevent the top element from taking precedence when we click on a menu item.
      // This happens when we have more than one element visible on the page.
      this.scrollToElement = null;
      return;
    }
    this.currentScroll = this.scrollable.measureScrollOffset('top');
    let currentSection = null;
    this.elements.forEach((element: any) => {
      const divPosition = element.offsetTop;
      if (divPosition - 1 < this.currentScroll || !currentSection) {
        currentSection = element;
      }
     });
    this.setCurrentSelection(currentSection.id);
  }

}
