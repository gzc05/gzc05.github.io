function switchNightMode() {
  // 创建动画层
  const darkSky = document.createElement('div');
  darkSky.className = 'Cuteen_DarkSky';
  darkSky.innerHTML = `
    <div class="Cuteen_DarkPlanet">
      <div id="sun"></div>
      <div id="moon"></div>
    </div>
  `;
  document.body.appendChild(darkSky);

  // 获取当前主题状态
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  // 获取太阳/月亮元素并设置初始状态
  const sun = darkSky.querySelector('#sun');
  const moon = darkSky.querySelector('#moon');
  
  // 设置初始透明度（避免闪烁）
  if (isDark) {
    sun.style.opacity = "0";
    moon.style.opacity = "1";
  } else {
    sun.style.opacity = "1";
    moon.style.opacity = "0";
  }

  // 立即切换主题状态
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun');
  }

  // 强制重排，确保过渡效果触发
  darkSky.offsetWidth;

  // 执行太阳/月亮切换动画
  setTimeout(() => {
    // 添加过渡样式
    if (sun && moon) {
      sun.style.transition = 'opacity 1s ease-in-out';
      moon.style.transition = 'opacity 1s ease-in-out';
      
      if (isDark) {
        sun.style.opacity = "1";
        moon.style.opacity = "0";
      } else {
        sun.style.opacity = "0";
        moon.style.opacity = "1";
      }
    }

    // 动画结束后淡出背景
    setTimeout(() => {
      if (darkSky) {
        darkSky.style.transition = 'opacity 1s ease-in-out';
        darkSky.style.opacity = "0";
        
        // 完全淡出后移除元素
        setTimeout(() => {
          if (darkSky.parentNode) {
            darkSky.parentNode.removeChild(darkSky);
          }
          
          // 显示通知
          if (isDark) {
            showNotification("开灯啦🌞", "当前已成功切换至白天模式！");
          } else {
            showNotification("关灯啦🌙", "当前已成功切换至夜间模式！");
          }
        }, 1000);
      }
    }, 1500);
  }, 100);

  // 同步第三方组件
  typeof utterancesTheme === 'function' && utterancesTheme();
  typeof FB === 'object' && window.loadFBComment();
  window.DISQUS && document.getElementById('disqus_thread').children.length && 
    setTimeout(() => window.disqusReset(), 200);
}

// 封装通知函数
function showNotification(title, message) {
  new Vue({
    data: function() {
      this.$notify({
        title,
        message,
        position: 'top-left',
        offset: 50,
        showClose: true,
        type: "success",
        duration: 5000
      });
    }
  });
}