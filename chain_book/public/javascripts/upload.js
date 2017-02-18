(function () {
    var input = document.getElementById("images"),
        formdata = false;

    if (window.FormData) {
        formdata = new FormData();
        document.getElementById("btn").style.display = "none";
    }

    function showUploadedItem(source) {
        var list = document.getElementById("image-list"),
            li = document.createElement("li"),
            img = document.createElement("img");
        img.src = source;
        li.appendChild(img);
        list.appendChild(li);
    }
    if (input.addEventListener) {
        input.addEventListener("change", function (evt) {
            var i = 0,
                len = this.files.length,
                img, reader, file;

            document.getElementById("response").innerHTML = "Uploading . . ."
            console.log(len)
            for (; i < len; i++) {
                file = this.files[i];
                if (!!file.type.match(/image.*/)) {
                    if (window.FileReader) {
                        reader = new FileReader();
                        reader.onloadend = function (e) {
                            showUploadedItem(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                    if (formdata) {
                        formdata.append("images", file);
                        $.ajax({
                            url: "http://127.0.0.1:3000/Books/bookPic/uploading",
                            type: "POST",
                            // beforeSend: function (xhr) {
                            //     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                            // },
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function (res) {
                                document.getElementById("response").innerHTML = res;
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        });
                    }
                }
            }

        }, false);
    }
})();