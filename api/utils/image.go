package utils

import (
	"github.com/dchest/uniuri"
	"github.com/nfnt/resize"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"strings"
)

const (
	UploadsDir = "public/uploads"
)

func generateRandomFilename(contentType string) string {
	filename := uniuri.New()
	if contentType == "image/png" {
		return filename + ".png"
	}
	return filename + ".jpg"
}

func ProcessImage(src multipart.File, contentType string) (string, error) {

	filename := generateRandomFilename(contentType)

	if err := os.MkdirAll(UploadsDir+"/thumbnails", 0777); err != nil && !os.IsExist(err) {
		return filename, err
	}

	// make thumbnail
	var (
		img image.Image
		err error
	)

	if contentType == "image/png" {
		img, err = png.Decode(src)
	} else {
		img, err = jpeg.Decode(src)
	}

	if err != nil {
		return filename, err
	}

	thumb := resize.Thumbnail(300, 300, img, resize.Lanczos3)
	dst, err := os.Create(strings.Join([]string{UploadsDir, "thumbnails", filename}, "/"))

	if err != nil {
		return filename, err
	}

	defer dst.Close()

	if contentType == "image/png" {
		png.Encode(dst, thumb)
	} else if contentType == "image/jpeg" {
		jpeg.Encode(dst, thumb, nil)
	}

	src.Seek(0, 0)

	dst, err = os.Create(strings.Join([]string{UploadsDir, filename}, "/"))

	if err != nil {
		return filename, err
	}

	defer dst.Close()

	_, err = io.Copy(dst, src)
	if err != nil {
		return filename, err
	}

	return filename, nil

}
