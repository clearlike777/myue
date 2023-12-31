export const ExportTable = (fileName, table) => {
    return new Promise((resolve) => {
        let $form = document.createElement("form");
        let $fileName = document.createElement("input");
        let $content = document.createElement("input");
        $fileName.type = "hidden";
        $fileName.value = encodeURIComponent(fileName || "导出文件") + ".xls";
        $fileName.name = "FileName";

        $content.type = "hidden";
        $content.value = table;
        $content.name = "exportContent";

        $form.appendChild($fileName);
        $form.appendChild($content);
        $form.style.display = "none";
        $form.method = "post";
        $form.action = "/export";
        if (window && window.HD && window.HD.getUrlParam) {
            let uniwater_utoken = window.HD.getUrlParam("uniwater_utoken");
            if (uniwater_utoken) {
                sessionStorage.setItem("uniwater_utoken", uniwater_utoken);
            } else {
                uniwater_utoken = sessionStorage.getItem("uniwater_utoken");
            }
            if (uniwater_utoken) {
                $form.action += '?uniwater_utoken=' + uniwater_utoken;
            }
        }
        $form.enctype = "multipart/form-data";
        document.body.appendChild($form);
        $form.submit();
        document.body.removeChild($form);
        resolve();
    });
};

export const Print = (html) => {
    return new Promise((resolve) => {
        let opener = window.open("");
        opener.document.write(html);
        opener.window.addEventListener("afterprint", () => {
            opener.close();
            resolve();
        });
        opener.document.execCommand("print");
    });
};