// main.js

/**
 * 根据当前访问的协议 + 主机 + 端口，动态返回背景图 URL
 */
function getBackgroundImageUrl() {
    const { protocol, hostname, port } = window.location;

    // 构建完整的 host:port 字符串（注意：port 为空时不要加冒号）
    const hostWithPort = port ? `${hostname}:${port}` : hostname;

    // 授权的正式域名列表（这些域名允许加载 OSS 图片）
    const authorizedHosts = [
        'facewind1.github.io',
        'familywang.top',
        'www.familywang.top',
        'excalidraw.familywang.top',
        'alist.familywang.top'
        // 可继续添加其他你控制的子域名
    ];

    // 检查是否是授权域名（忽略端口，因为线上通常无端口或为 80/443）
    if (authorizedHosts.includes(hostname)) {
        return 'https://wangyk.oss-cn-chengdu.aliyuncs.com/background.jpg';
    }

    // 特判：本地开发环境 http://127.0.0.1:5050
    if (protocol === 'http:' && hostWithPort === '127.0.0.1:5050') {
        return 'img/background.png'; // 相对路径，相对于 HTML 文件所在目录
    }

    // 可选：其他本地开发环境（如 localhost:5050、file://）也使用本地图片
    // 如果你希望严格只对 127.0.0.1:5050 生效，可删除下面这一段
    if (hostname === 'localhost' || hostname === '127.0.0.1' || protocol === 'file:') {
        return 'img/background.png';
    }

    // 默认 fallback（比如未知域名），可设为空或本地图
    return '';
}

/**
 * 设置 body 背景图片
 */
function setBackgroundImage() {
    const bgUrl = getBackgroundImageUrl();
    const img = new Image();

    img.onload = () => {
        document.body.style.backgroundImage = `url(${bgUrl})`;
    };

    img.onerror = () => {
        console.warn('背景图加载失败:', bgUrl);
        // 可选：设置纯色背景作为兜底
        document.body.style.backgroundColor = '#e0e0e0';
    };

    img.src = bgUrl;
}

// 等 DOM 加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setBackgroundImage);
} else {
    setBackgroundImage();
}