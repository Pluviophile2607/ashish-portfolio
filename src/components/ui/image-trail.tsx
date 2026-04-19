import { gsap } from 'gsap';
import { useEffect, useRef, type JSX } from 'react';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): { x: number; y: number } {
  let clientX = 0, clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  public DOM: { el: HTMLElement; inner: HTMLElement | null } = {
    el: null as unknown as HTMLElement,
    inner: null
  };
  public rect: DOMRect | null = null;
  private resizeListener: () => void;

  constructor(el: HTMLElement) {
    this.DOM.el = el;
    this.DOM.inner = el.querySelector('.content__img-inner');
    this.getRect();
    this.resizeListener = () => this.getRect();
    window.addEventListener('resize', this.resizeListener);
  }

  public getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  public destroy() {
    window.removeEventListener('resize', this.resizeListener);
  }
}

class ImageTrailVariant2 {
  private container: HTMLElement;
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number = 0;
  private zIndexVal: number = 10;
  private activeImagesCount: number = 0;
  private threshold: number = 40;
  private mousePos = { x: 0, y: 0 };
  private lastMousePos = { x: 0, y: 0 };
  private cacheMousePos = { x: 0, y: 0 };
  private rafId: number | null = null;

  private onMouseMove = (ev: MouseEvent | TouchEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mousePos = getLocalPointerPos(ev, rect);
    if (!this.rafId) {
      this.cacheMousePos = { ...this.mousePos };
      this.render();
    }
  };

  constructor(container: HTMLElement) {
    this.container = container;
    const items = gsap.utils.toArray<HTMLElement>(container.querySelectorAll('.content__img'));
    this.images = items.map(el => new ImageItem(el));
    this.imagesTotal = this.images.length;
    
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchmove', this.onMouseMove);
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    this.imgPosition = (this.imgPosition + 1) % this.imagesTotal;
    const img = this.images[this.imgPosition];
    if (!img.rect || img.rect.width === 0) img.getRect();

    this.zIndexVal++;
    this.onImageActivated();

    gsap.killTweensOf(img.DOM.el);
    const tl = gsap.timeline({
      onComplete: () => this.onImageDeactivated()
    });

    tl.fromTo(img.DOM.el, 
      {
        opacity: 1,
        scale: 0,
        zIndex: this.zIndexVal,
        x: this.cacheMousePos.x - (img.rect?.width || 0) / 2,
        y: this.cacheMousePos.y - (img.rect?.height || 0) / 2
      }, 
      {
        duration: 0.4,
        ease: 'power1.out',
        scale: 1,
        x: this.mousePos.x - (img.rect?.width || 0) / 2,
        y: this.mousePos.y - (img.rect?.height || 0) / 2
      }
    )
    .fromTo(img.DOM.inner, 
      { scale: 2, filter: 'brightness(200%)' }, 
      { duration: 0.4, ease: 'power1.out', scale: 1, filter: 'brightness(100%)' }, 
      0
    )
    .to(img.DOM.el, 
      { duration: 0.5, ease: 'power2.in', opacity: 0, scale: 0.2 }, 
      0.4
    );
  }

  private onImageActivated() { this.activeImagesCount++; }
  private onImageDeactivated() { this.activeImagesCount--; }

  public destroy() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onMouseMove);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.images.forEach(img => img.destroy());
  }
}

export default function ImageTrail({ items = [] }: { items?: string[] }): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const trail = new ImageTrailVariant2(containerRef.current);
    return () => trail.destroy();
  }, [items]);

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" ref={containerRef}>
      {items.map((url, i) => (
        <div key={`${url}-${i}`} className="content__img absolute top-0 left-0 w-[240px] aspect-[1.1] opacity-0 overflow-hidden rounded-2xl will-change-transform">
          <div className="content__img-inner absolute inset-[-10px] bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
        </div>
      ))}
    </div>
  );
}
