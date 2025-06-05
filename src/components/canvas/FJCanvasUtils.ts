const DEFAULT_STROKE_COLOR = '#0000ff';
const DEFAULT_STROKE_WIDTH = 20;
const DEFAULT_ERASER_COLOR = '#fff';

const CANVAS_FIT_PADDING_X = 16;
const CANVAS_FIT_PADDING_Y = 48;

/**
 * 画布SDK
 * @class
 * 提供画布的绘制功能
 */
export class FJCanvasUtils {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    private _isDrawing: boolean = false;
    private _strokeColor: string | CanvasGradient | CanvasPattern = DEFAULT_STROKE_COLOR;
    private _strokeWidth: number = DEFAULT_STROKE_WIDTH;
    private _eraserColor: string | CanvasGradient | CanvasPattern = DEFAULT_ERASER_COLOR;
    private _lastPoint: { x: number; y: number } = { x: 0, y: 0 };
    private _scale: number = 1;
    private _scaleToFit: number = 1;

    /**
     * 构造函数
     * @constructor
     * @param {HTMLCanvasElement} canvasEl 画布元素
     * @param {number} width 画布宽度
     * @param {number} height 画布高度
     */
    constructor(canvasEl: HTMLCanvasElement, width: number, height: number) {
        this.canvas = canvasEl;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Canvas context is not supported');
        }

        this.ctx = ctx;

        // 设置实际像素大小以避免模糊
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;

        // 设置显示大小
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        // this.canvas.style.transformOrigin = 'center center';

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // const scaleX = window.innerWidth / this.canvas.width;
        // const scaleY = window.innerHeight / this.canvas.height;

        // const scaleToFit = Math.min(scaleX, scaleY);
        // this.scaleToCover = Math.max(scaleX, scaleY);

        // ctx.scale(scaleToFit, scaleToFit);
    }

    /**
     * 绘制填充矩形
     * @param {number} x 左上角X坐标
     * @param {number} y 左上角Y坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} color 填充颜色
     */
    fillRect(x: number, y: number, width: number, height: number, color: string = '#000000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    /**
     * 绘制空心矩形
     * @param {number} x 左上角X坐标
     * @param {number} y 左上角Y坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {string} color 边框颜色
     * @param {number} lineWidth 边框宽度
     */
    strokeRect(x: number, y: number, width: number, height: number, color: string = '#000000', lineWidth: number = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    /**
     * 清除指定区域
     * @param {number} x 左上角X坐标
     * @param {number} y 左上角Y坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    clearRect(x: number, y: number, width: number, height: number) {
        this.ctx.clearRect(x, y, width, height);
    }

    /**
     * 清除整个画布
     */
    clear() {
        this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * 绘制直线
     * @param {number} x1 起点X坐标
     * @param {number} y1 起点Y坐标
     * @param {number} x2 终点X坐标
     * @param {number} y2 终点Y坐标
     * @param {string} color
     * @param {number} lineWidth
     */
    drawLine(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        color: string | CanvasGradient | CanvasPattern = '#000000',
        lineWidth: number = 1,
    ) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';

        // this.ctx.beginPath();
        // this.ctx.arc(x1 / this._scale, y1 / this._scale, lineWidth / 2, 0, Math.PI * 2);
        // this.ctx.fillStyle = this._strokeColor;
        // this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(x1 / this._scale, y1 / this._scale);
        this.ctx.lineTo(x2 / this._scale, y2 / this._scale);
        this.ctx.stroke();
        this.ctx.setTransform();
    }

    /**
     * 绘制直线移动
     * @private
     * @param {MouseEvent} e 鼠标事件
     */
    private _drawLineMove = (e: MouseEvent) => {
        if (!this._isDrawing) return;

        const { clientX, clientY } = e;
        const { left, top } = this.canvas.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;

        this.drawLine(this._lastPoint.x, this._lastPoint.y, offsetX, offsetY, this._strokeColor, this._strokeWidth);
        this._lastPoint = { x: offsetX, y: offsetY };
    };
    /**
     * 开始绘制直线
     */
    startDrawLine() {
        this.canvas.addEventListener('mousedown', e => {
            this._isDrawing = true;
            const { clientX, clientY } = e;
            const { left, top } = this.canvas.getBoundingClientRect();
            this._lastPoint = { x: clientX - left, y: clientY - top };
        });

        this.canvas.addEventListener('mouseup', () => {
            this._isDrawing = false;
        });

        this.canvas.addEventListener('mousemove', this._drawLineMove);
    }

    /**
     * 停止绘制直线
     */
    stopDrawLine() {
        this._isDrawing = false;
        this.canvas.removeEventListener('mousedown', () => {
            this._isDrawing = true;
        });
        this.canvas.removeEventListener('mouseup', () => {
            this._isDrawing = false;
        });
        this.canvas.removeEventListener('mousemove', this._drawLineMove);
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
     * 设置擦除颜色
     * @param {string | CanvasPattern} color 颜色
     */
    setEraserColor(color: string | CanvasPattern) {
        this._eraserColor = color;
    }

    /**
     * 擦除移动
     * @private
     * @param {MouseEvent} e 鼠标事件
     */
    private _eraserMove = (e: MouseEvent) => {
        if (!this._isDrawing) return;

        const { clientX, clientY, movementX, movementY } = e;
        const { left, top } = this.canvas.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;

        this.drawLine(offsetX - movementX, offsetY - movementY, offsetX, offsetY, this._eraserColor, this._strokeWidth);
    };

    /**
     * 开始擦除
     */
    startEraser() {
        this.canvas.addEventListener('mousedown', () => {
            this._isDrawing = true;
        });

        this.canvas.addEventListener('mouseup', () => {
            this._isDrawing = false;
        });

        this.canvas.addEventListener('mousemove', this._eraserMove);
    }

    /**
     * 停止擦除
     */
    stopEraser() {
        this._isDrawing = false;
        this.canvas.removeEventListener('mousedown', () => {
            this._isDrawing = true;
        });
        this.canvas.removeEventListener('mouseup', () => {
            this._isDrawing = false;
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
        const dpr = window.devicePixelRatio || 1;
        const offscreen = document.createElement('canvas');

        // 使用设备像素比创建更大的离屏画布
        offscreen.width = image.naturalWidth * dpr;
        offscreen.height = image.naturalHeight * dpr;

        // 计算缩放比例（基于显示尺寸）
        const scaleX = this.canvas.width / (image.naturalWidth * dpr - CANVAS_FIT_PADDING_X * dpr);
        const scaleY = this.canvas.height / (image.naturalHeight * dpr - CANVAS_FIT_PADDING_Y * dpr);
        const scaleToFit = Math.min(scaleX, scaleY);
        this._scaleToFit = scaleToFit;

        // 计算居中位置（考虑DPR）
        const scaledWidth = image.naturalWidth * dpr * scaleToFit;
        const scaledHeight = image.naturalHeight * dpr * scaleToFit;
        const centerX = (this.canvas.width - scaledWidth) / 2;
        const centerY = (this.canvas.height - scaledHeight) / 2;

        try {
            const offscreenCtx = offscreen.getContext('2d', {
                alpha: true,
                willReadFrequently: true,
            });
            if (!offscreenCtx) throw new Error('Failed to get offscreen context');

            // 设置离屏画布的缩放以匹配设备像素比
            offscreenCtx.scale(dpr, dpr);

            // 在离屏画布上绘制原始图片
            offscreenCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

            // 清除主画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.setScale(1);

            // 在主画布上绘制高清图片
            this.ctx.drawImage(offscreen, centerX, centerY, scaledWidth, scaledHeight);

            // 创建图案时使用原始大小的画布
            const patternCanvas = document.createElement('canvas');
            patternCanvas.width = image.naturalWidth;
            patternCanvas.height = image.naturalHeight;
            const patternCtx = patternCanvas.getContext('2d');
            if (!patternCtx) throw new Error('Failed to get pattern context');

            patternCtx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
            return this.ctx.createPattern(patternCanvas, 'repeat');
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
        this.canvas.style.transform = 'scale(' + scale + ')';
    }
    /**
     * 销毁画布
     */
    destroy() {
        this._isDrawing = false;
        // TODO: 销毁事件
    }
}
