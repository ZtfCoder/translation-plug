import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const provider = new CursorWebviewViewProvider();

  const curosrDispose = vscode.window.registerWebviewViewProvider(
    "myCustomView",
    provider,
    {
      webviewOptions: { retainContextWhenHidden: true },
    }
  );


  context.subscriptions.push(
    vscode.commands.registerCommand('myExtension.openWebview', () => {
      const panel = vscode.window.createWebviewPanel(
        'myWebview',
        'My Webview',
        vscode.ViewColumn.One,
        {
          enableScripts: true, // Enable JavaScript in the webview
        }
      );

      panel.webview.html = getWebviewContent();

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        message => {
          switch (message.command) {
            case 'translate':
              translateText(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

class CursorWebviewViewProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = getWebviewContent();
    webviewView.webview.onDidReceiveMessage(
      async (data) => {
        switch (data.type) {
          case 'onInfo': {
            vscode.window.showInformationMessage(data.value);
            return;
          }
        }
      },
      undefined,
      context.subscriptions
    );
  }
  
}



function getWebviewContent() {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>My Webview</title>
      <style>
        body {
          /* 背景透明 */
          background-color: #3B3F41;
        }
        .input{
          padding: 10px;
          width: 100%;
          font-size: 16px;
          border-radius: 5px; /* 添加圆角 */
          border: none; /* 去除默认的轮廓线 */
          outline: 1px solid #838181; /* 添加轮廓线 */
          background-color: transparent; /* 背景透明 */
          color: #ccc; /* 字体颜色 */
      }
      .input:focus{
          outline: 1px solid #007bff;
      } 
        .inputBox {
          position: absolute;
          bottom: 10px;
          width: 80vw;
        }
        .message{
          max-width: 80vw;
          margin: 10px;
          border: 1px solid #838181;
          border-radius: 5px; /* 添加圆角 */
          padding: 10px;
        }
        .content{
           /*  换行 */
           word-wrap: break-word;
          /* 限制最大宽度 */
        
          padding: 10px;
          font-size: 16px;
          border-radius: 5px; /* 添加圆角 */
          border: none; /* 去除默认的轮廓线 */
          background-color: #2B2B2B;
          color: #007bff;
        }
        .title{
          color: #ccc;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="messageBox">
        </div>
        <div class="inputBox">
          <input placeholder="请输入你要翻译的内容" type="text" class="input" />
        </div>
      </div>
  
      <script>
            document.querySelector('.input').addEventListener('keydown', function(event) {
          if (event.keyCode === 13) { // 如果按下的是回车键
              event.preventDefault(); // 阻止默认行为，如表单提交
              // 获取value
              const inputValue = event.target.value;
              if(inputValue.trim()){
                  // 创建一个新的div
                  const newMessage = document.createElement('div');
                  newMessage.className = 'message';
                  newMessage.innerHTML = "
                              <div class="title">翻译->=`${inputValue.trim()}`</div>
                              <div class="content">13233333333333333 </div>
                          ";
                  document.querySelector('.messageBox').appendChild(newMessage);
                  // 清空输入框
                  event.target.value = '';
              }    
               // vscode.postMessage({
          //   command: "translate",
          //   text: inputValue,
          // });
          }
      });
      </script>
    </body>
  </html>
  

  
  `;
}

async function translateText(text: string) {
  // Call your translation API here. This is just a placeholder.
  const translatedText = await Promise.resolve('Translated text');

  vscode.window.showInformationMessage(`Translated text: ${translatedText}`);
}