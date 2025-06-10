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

/**
 * 画布SDK
 * @class
 * 提供画布的绘制功能
 */
export class FJCanvasUtils {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private _isDrawing: boolean = false;
    private _isEraser: boolean = false;
    private _strokeColor: string | CanvasGradient | CanvasPattern = DEFAULT_STROKE_COLOR;
    private _strokeWidth: number = DEFAULT_STROKE_WIDTH;
    // private _eraserColor: string | CanvasGradient | CanvasPattern = DEFAULT_ERASER_COLOR;
    // private _lastPoint: Point = { x: 0, y: 0 };
    private _scale: number = 1;
    private _scaleToFit: number = 1;
    private _dpr: number = window.devicePixelRatio || 1;
    private _image: HTMLImageElement | null = null;
    private isInEraserMode: boolean = false;
    private _maskCanvas: HTMLCanvasElement | null = null;
    private _maskCtx: CanvasRenderingContext2D | null = null;

    /**
     * 构造函数
     * @constructor
     * @param {HTMLCanvasElement} canvasEl 画布元素
     * @param {number} width 画布宽度
     * @param {number} height 画布高度
     */
    constructor(canvasEl: HTMLCanvasElement, width: number, height: number, defaultConfig?: DefaultConfig) {
        this.canvas = canvasEl;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context is not supported');
        }

        this.ctx = ctx;

        // 设置实际像素大小以避免模糊
        this.canvas.width = width * this._dpr;
        this.canvas.height = height * this._dpr;

        // 设置显示大小
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

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
            isEraser: this._isEraser,
            isDrawing: this._isDrawing,
            dpr: this._dpr,
            isInEraserMode: this.isInEraserMode,
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
        this.ctx.resetTransform();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

            const inv = this.ctx.getTransform().inverse();
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
        if (!this._isDrawing || !this._maskCtx || !this._maskCanvas) return;

        this._maskCtx.globalCompositeOperation = 'source-over';
        const { clientX, clientY } = e;
        const { left, top } = this.canvas.getBoundingClientRect();
        const x = (clientX - left) * this._dpr;
        const y = (clientY - top) * this._dpr;

        this.drawLine(x, y, this._strokeColor, this._strokeWidth);

        this._maskCtx.globalCompositeOperation = 'source-over';

        this._redraw();
    };

    private _drawMouseDown = (e: MouseEvent) => {
        this._isDrawing = true;

        this._drawLineMove(e);

        this.ctx.restore();
    };

    private _drawMouseUp = () => {
        this._isDrawing = false;
        // e.stopPropagation();
    };

    /**
     * 开始绘制直线
     */
    startDrawLine() {
        this.canvas.addEventListener('mousedown', this._drawMouseDown);

        this.canvas.addEventListener('mouseup', this._drawMouseUp);

        this.canvas.addEventListener('mousemove', this._drawLineMove);
    }

    /**
     * 停止绘制直线
     */
    stopDrawLine() {
        this._isDrawing = false;
        this.canvas.removeEventListener('mousedown', this._drawMouseDown);
        this.canvas.removeEventListener('mouseup', this._drawMouseUp);
        this.canvas.removeEventListener('mousemove', this._drawLineMove);
    }

    private _eraserMouseDown = (e: MouseEvent) => {
        this._isEraser = true;

        this._eraserMove(e);
    };

    private _eraserMouseUp = () => {
        this._isEraser = false;
        // e.stopPropagation();
    };

    /**
     * 擦除移动
     * @private
     * @param {MouseEvent} e 鼠标事件
     */
    private _eraserMove = (e: MouseEvent) => {
        if (!this._isEraser || !this._maskCtx || !this._maskCanvas) return;

        this._maskCtx.globalCompositeOperation = 'destination-out';
        const { clientX, clientY } = e;
        const { left, top } = this.canvas.getBoundingClientRect();
        const x = (clientX - left) * this._dpr;
        const y = (clientY - top) * this._dpr;

        this.drawLine(x, y, this._strokeColor, this._strokeWidth);

        this._maskCtx.globalCompositeOperation = 'source-over';

        this._redraw();
    };

    /**
     * 开始擦除
     */
    startEraser() {
        this.isInEraserMode = true;
        this.canvas.addEventListener('mousedown', this._eraserMouseDown);

        this.canvas.addEventListener('mouseup', this._eraserMouseUp);

        this.canvas.addEventListener('mousemove', this._eraserMove);
    }

    /**
     * 停止擦除
     */
    stopEraser() {
        this._isEraser = false;
        this.isInEraserMode = false;
        this.canvas.removeEventListener('mousedown', () => {
            this._isEraser = true;
        });
        this.canvas.removeEventListener('mouseup', () => {
            this._isEraser = false;
        });
        this.canvas.removeEventListener('mousemove', this._eraserMove);
    }

    /**
     * 绘制图片
     * @param {HTMLImageElement} image 图片
     * @param {number} x 左上角X坐标
     * @param {number} y 左上角Y坐标
     */
    drawImage(image: HTMLImageElement): CanvasPattern | null {
        // 清除画布
        this.clear();
        const offscreen = document.createElement('canvas');

        // 使用设备像素比创建更大的离屏画布
        offscreen.width = image.naturalWidth * this._dpr;
        offscreen.height = image.naturalHeight * this._dpr;

        // 计算缩放比例（基于显示尺寸）
        const scaleX = (this.canvas.width - CANVAS_FIT_PADDING_X * 2 * this._dpr) / (image.naturalWidth * this._dpr);
        const scaleY = (this.canvas.height - CANVAS_FIT_PADDING_Y * 2 * this._dpr) / (image.naturalHeight * this._dpr);
        const scaleToFit = Math.min(scaleX, scaleY);

        this._scaleToFit = scaleToFit;

        // 计算居中位置（考虑DPR）
        const scaledWidth = image.naturalWidth * this._dpr * scaleToFit;
        const scaledHeight = image.naturalHeight * this._dpr * scaleToFit;
        const centerX = (this.canvas.width - scaledWidth) / 2;
        const centerY = (this.canvas.height - scaledHeight) / 2;

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

            this.ctx.setTransform(scaleToFit * this._dpr, 0, 0, scaleToFit * this._dpr, centerX, centerY);
            this.ctx.save();

            // 在离屏画布上绘制原始图片
            offscreenCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

            // 在主画布上绘制高清图片
            this.ctx.drawImage(offscreen, 0, 0);

            this.ctx.restore();

            this._image = image;

            return this.ctx.createPattern(this.canvas, 'repeat');
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
        const ctx = this.ctx;
        this._clearCanvas();

        // 更新中心点偏移
        const localScale = this._scale * this._scaleToFit;
        const scaledWidth = this._image.naturalWidth * this._dpr * localScale;
        const scaledHeight = this._image.naturalHeight * this._dpr * localScale;
        // 计算居中位置（考虑DPR）
        const centerX = (this.canvas.width - scaledWidth) / 2;
        const centerY = (this.canvas.height - scaledHeight) / 2;

        this.ctx.setTransform(localScale * this._dpr, 0, 0, localScale * this._dpr, centerX, centerY);

        // 绘制图片;
        ctx.save();
        this.ctx.drawImage(this._image, 0, 0);

        if (this._maskCanvas && this._maskCtx) {
            // 绘制遮罩层 使用source-atop 和 globalAlpha 来实现遮罩层
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-atop';
            this.ctx.globalAlpha = 0.5;
            this.ctx.drawImage(this._maskCanvas, 0, 0);

            // 恢复全局透明度
            this.ctx.globalAlpha = 1;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.restore();
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

        this._isDrawing = false;
        this._isEraser = false;
        this.canvas.dispatchEvent(new Event('destroy'));
    }

    exportMaskData(): string | null {
        if (!this._maskCtx) return null;
        const imageData = this._maskCanvas?.toDataURL('image/jpeg');
        return imageData ?? null;
    }

    onDestroy(callback: () => void) {
        this.canvas.addEventListener('destroy', callback);
        return () => {
            this.canvas.removeEventListener('destroy', callback);
        };
    }
}
