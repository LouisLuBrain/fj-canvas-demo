const DEFAULT_STROKE_COLOR = '#0000ff';
const DEFAULT_STROKE_WIDTH = 20;

const CANVAS_FIT_PADDING_X = 16;
const CANVAS_FIT_PADDING_Y = 60;

interface DefaultConfig {
    strokeWidth?: number;
}

export interface FJCanvasUtilsSnapshot extends DefaultConfig {
    scale?: number;
    fitScale?: number;
    isEraser?: boolean;
    isDrawing?: boolean;
    dpr?: number;
    isInEraserMode?: boolean;
}

export enum FJCanvasMode {
    DRAW = 'DRAW',
    ERASER = 'ERASER'
}

/**
 * 画布SDK
 * @class
 * 提供画布的绘制功能
 */
export class FJCanvasUtils {
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    private _isBrushing: boolean = false;
    private _mode: FJCanvasMode = FJCanvasMode.DRAW;

    private _strokeColor: string | CanvasGradient | CanvasPattern = DEFAULT_STROKE_COLOR;
    private _strokeWidth: number = DEFAULT_STROKE_WIDTH;
    private _scale: number = 1;
    // TODO: optimize this property to boolean
    private _scaleToFit: number = 1;
    
    private _dpr: number = window.devicePixelRatio || 1;
    private _image: HTMLImageElement | null = null;
    private _maskCanvas: HTMLCanvasElement | null = null;
    private _maskCtx: CanvasRenderingContext2D | null = null;
    private _lastPoint: { x: number; y: number } | null = null;

    /**
     * 构造函数
     * @constructor
     * @param {HTMLCanvasElement} canvasEl 画布元素
     * @param {number} width 画布宽度
     * @param {number} height 画布高度
     */
    constructor(canvasEl: HTMLCanvasElement, width: number, height: number, defaultConfig?: DefaultConfig) {
        this._canvas = canvasEl;
        const ctx = this._canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Your browser does not support canvas. Please use a modern browser.');
        }

        this._ctx = ctx;

        // 设置实际像素大小以避免模糊
        this._canvas.width = width * this._dpr;
        this._canvas.height = height * this._dpr;

        // 设置显示大小
        this._canvas.style.width = `${width}px`;
        this._canvas.style.height = `${height}px`;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        this._strokeWidth = defaultConfig?.strokeWidth || DEFAULT_STROKE_WIDTH;

        this._maskCanvas = document.createElement('canvas');
        this._maskCtx = this._maskCanvas.getContext('2d')!;
    }

    /**
     * 获取配置
     * @returns {FJCanvasUtilsSnapshot} 配置
     */
    getConfig(): FJCanvasUtilsSnapshot {
        return {
            strokeWidth: this._strokeWidth,
            scale: this._scale,
            fitScale: this._scaleToFit,
            isEraser: this._mode === FJCanvasMode.ERASER,
            isDrawing: this._isBrushing,
            dpr: this._dpr,
            isInEraserMode: this._mode === FJCanvasMode.ERASER,
        };
    }

    /**
     * 设置画笔颜色
     * @param {string | CanvasGradient | CanvasPattern} color 颜色
     */
    setStrokeColor(color: string | CanvasGradient | CanvasPattern) {
        this._strokeColor = color;
    }

    /**
     * 设置画笔宽度
     * @param {number} width 宽度
     */
    setStrokeWidth(width: number) {
        this._strokeWidth = width;
    }

    /**
     * 清除整个画布
     */
    clear() {
        this._clearCanvas();
        this._clearMask();
    }

    private _clearMask() {
        if (this._maskCtx && this._maskCanvas) {
            this._maskCtx?.resetTransform();

            this._maskCtx.clearRect(0, 0, this._maskCanvas.width, this._maskCanvas.height);
        }
    }

    private _clearCanvas() {
        this._ctx.resetTransform();
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    private _drawInterpolatedLine(
        from: { x: number; y: number },
        to: { x: number; y: number },
        color: string | CanvasGradient | CanvasPattern,
        lineWidth: number,
    ) {
        const distance = Math.hypot(to.x - from.x, to.y - from.y);
        const step = 1; // 每 step 像素绘制一个点，越小越细腻

        for (let i = 0; i < distance; i += step) {
            const t = i / distance;
            const x = from.x + (to.x - from.x) * t;
            const y = from.y + (to.y - from.y) * t;
            this.drawLine(x, y, color, lineWidth);
        }
    }

    /**
     * 绘制直线
     * @param {number} x1 mouse x
     * @param {number} y1 mouse y
     * @param {string} color
     * @param {number} lineWidth
     */
    drawLine(
        x1: number,
        y1: number,
        color: string | CanvasGradient | CanvasPattern = '#000000',
        lineWidth: number = 1,
    ) {
        if (this._maskCtx && this._maskCanvas) {
            this._maskCtx.save();

            const inv = this._ctx.getTransform().inverse();
            const logicalPoint = new DOMPoint(x1, y1).matrixTransform(inv);

            this._maskCtx.fillStyle = color;
            this._maskCtx.beginPath();
            this._maskCtx.arc(
                logicalPoint.x,
                logicalPoint.y,
                lineWidth / 2 / this._scaleToFit / this._dpr,
                0,
                Math.PI * 2,
            );

            this._maskCtx.fill();

            this._maskCtx.restore();
        }
    }

    /**
     * 绘制直线移动
     * @private
     * @param {MouseEvent} e 鼠标事件
     */
    private _drawLineMove = (e: MouseEvent) => {
        if (!this._isBrushing || !this._maskCtx || !this._maskCanvas) return;

        this._maskCtx.globalCompositeOperation = 
            this._mode === FJCanvasMode.ERASER ? 'destination-out' : 'source-over';
            
        const { clientX, clientY } = e;
        const { left, top } = this._canvas.getBoundingClientRect();
        const x = (clientX - left) * this._dpr;
        const y = (clientY - top) * this._dpr;

        const currentPoint = { x, y };
        const last = this._lastPoint;

        if (last) {
            this._drawInterpolatedLine(last, currentPoint, this._strokeColor, this._strokeWidth);
        }

        this._lastPoint = currentPoint;
        this._maskCtx.globalCompositeOperation = 'source-over';

        this._redraw();
    };

    private _drawMouseDown = (e: MouseEvent) => {
        this._isBrushing = true;
        this._lastPoint = null;
        // 绘制第一个点
        if (this._maskCtx) {
            this._maskCtx.globalCompositeOperation = 
                this._mode === FJCanvasMode.ERASER ? 'destination-out' : 'source-over';
                
            const { clientX, clientY } = e;
            const { left, top } = this._canvas.getBoundingClientRect();
            const x = (clientX - left) * this._dpr;
            const y = (clientY - top) * this._dpr;
            this.drawLine(x, y, this._strokeColor, this._strokeWidth);

            this._maskCtx.globalCompositeOperation = 'source-over';
            this._redraw();
        }
    };

    private _drawMouseUp = () => {
        this._isBrushing = false;
    };

    /**
     * 开始绘制直线
     */
    startDrawLine() {
        this._mode = FJCanvasMode.DRAW;
        this._addEventListeners();
    }
    /**
     * 开始擦除
     */
    startEraser() {
        this._mode = FJCanvasMode.ERASER;
        this._addEventListeners();
    }

    private _addEventListeners() {
        this._removeEventListeners(); // 先移除已有的事件监听
        this._canvas.addEventListener('mousedown', this._drawMouseDown);
        this._canvas.addEventListener('mouseup', this._drawMouseUp);
        this._canvas.addEventListener('mousemove', this._drawLineMove);
    }

    private _removeEventListeners() {
        this._canvas.removeEventListener('mousedown', this._drawMouseDown);
        this._canvas.removeEventListener('mouseup', this._drawMouseUp);
        this._canvas.removeEventListener('mousemove', this._drawLineMove);
    }

    stopDrawLine() {
        this._isBrushing = false;
        this._removeEventListeners();
    }

    stopEraser() {
        this._isBrushing = false;
        this._removeEventListeners();
    }

    /**
     * 绘制图片
     * @param {HTMLImageElement} image 图片
     */
    drawImage(image: HTMLImageElement): CanvasPattern | null {
        // 清除画布
        this.clear();
        const offscreen = document.createElement('canvas');

        // 使用设备像素比创建更大的离屏画布
        offscreen.width = image.naturalWidth * this._dpr;
        offscreen.height = image.naturalHeight * this._dpr;

        // 计算缩放比例（基于显示尺寸）
        const scaleX = (this._canvas.width - CANVAS_FIT_PADDING_X * 2 * this._dpr) / (image.naturalWidth * this._dpr);
        const scaleY = (this._canvas.height - CANVAS_FIT_PADDING_Y * 2 * this._dpr) / (image.naturalHeight * this._dpr);
        const scaleToFit = Math.min(scaleX, scaleY);

        this._scaleToFit = scaleToFit;

        // 计算居中位置（考虑DPR）
        const scaledWidth = image.naturalWidth * this._dpr * scaleToFit;
        const scaledHeight = image.naturalHeight * this._dpr * scaleToFit;
        const centerX = (this._canvas.width - scaledWidth) / 2;
        const centerY = (this._canvas.height - scaledHeight) / 2;

        if (this._maskCanvas) {
            this._maskCanvas.width = image.naturalWidth;
            this._maskCanvas.height = image.naturalHeight;
        }

        try {
            const offscreenCtx = offscreen.getContext('2d', {
                alpha: true,
                willReadFrequently: true,
            });
            if (!offscreenCtx) throw new Error('Failed to get offscreen context');

            this._ctx.setTransform(scaleToFit * this._dpr, 0, 0, scaleToFit * this._dpr, centerX, centerY);
            this._ctx.save();

            // 在离屏画布上绘制原始图片
            offscreenCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

            // 在主画布上绘制高清图片
            this._ctx.drawImage(offscreen, 0, 0);

            this._ctx.restore();

            this._image = image;

            return this._ctx.createPattern(this._canvas, 'repeat');
        } catch (error) {
            console.error('Failed to draw image:', error);
            return null;
        }
    }

    /**
     * 设置画布缩放比例
     * @param {number} scale 缩放比例
     */
    setScale(scale: number) {
        this._scale = scale;
        this._redraw();
    }

    private _redraw() {
        if (!this._image) return;
        const ctx = this._ctx;
        this._clearCanvas();

        // 更新中心点偏移
        const localScale = this._scale * this._scaleToFit;
        const scaledWidth = this._image.naturalWidth * this._dpr * localScale;
        const scaledHeight = this._image.naturalHeight * this._dpr * localScale;
        // 计算居中位置（考虑DPR）
        const centerX = (this._canvas.width - scaledWidth) / 2;
        const centerY = (this._canvas.height - scaledHeight) / 2;

        this._ctx.setTransform(localScale * this._dpr, 0, 0, localScale * this._dpr, centerX, centerY);

        // 绘制图片;
        ctx.save();
        this._ctx.drawImage(this._image, 0, 0);

        if (this._maskCanvas && this._maskCtx) {
            // 绘制遮罩层 使用source-atop 和 globalAlpha 来实现遮罩层
            this._ctx.save();
            // FIXME: blur 效果不能兼容 safari
            // this._ctx.filter = 'blur(12px)';
            this._ctx.globalCompositeOperation = 'source-atop';
            this._ctx.globalAlpha = 0.5;
            this._ctx.drawImage(this._maskCanvas, 0, 0);

            // 恢复全局透明度
            this._ctx.globalAlpha = 1;
            this._ctx.globalCompositeOperation = 'source-over';
            this._ctx.restore();
        }

        ctx.restore();
    }

    /**
     * 销毁画布
     */
    destroy() {
        this.clear();

        this.stopDrawLine();
        this.stopEraser();

        this._isBrushing = false;
        this._mode = FJCanvasMode.DRAW;
        this._canvas.dispatchEvent(new Event('destroy'));
    }

    exportMaskData(): string | null {
        if (!this._maskCtx) return null;
        const imageData = this._maskCanvas?.toDataURL('image/jpeg');
        return imageData ?? null;
    }

    onDestroy(callback: () => void) {
        this._canvas.addEventListener('destroy', callback);
        return () => {
            this._canvas.removeEventListener('destroy', callback);
        };
    }
}
