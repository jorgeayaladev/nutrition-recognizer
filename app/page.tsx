"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Webcam from "react-webcam"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as tmImage from "@teachablemachine/image"
import {
  faCameraRetro,
  faCameraRotate,
  faVideo,
  faImage,
  faEyeSlash,
  faCircleCheck,
  faCheck,
} from "@fortawesome/free-solid-svg-icons"

export default function Home() {
  // Delete any
  const webcamRef = useRef<any>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [model, setModel] = useState<any>(null)

  const videoConstraints = {
    width: 320,
    height: 180,
    facingMode: "environment",
  }

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setUrl(imageSrc)
  }, [webcamRef])

  const captureImage = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  // Delete any
  const onUserMedia = (e: any) => {
    console.log(e)
  }

  const prediction = async () => {
    if (url) {
      const imageElement = document.createElement("img") // Use DOM HTMLImageElement
      imageElement.src = url

      const allPredictions = await model.predict(imageElement, true)
      //console.log(allPredictions)

      const bestProbability = allPredictions.sort(
        (a: any, b: any) => b.probability - a.probability
      )[0]

      window.location.assign(
        "https://es.wikipedia.org/wiki/" + bestProbability.className
      )
    }
  }

  useEffect(() => {
    const loadModel = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/1kn3yGMuS"
      const model = await tmImage.load(
        URL + "/model.json",
        URL + "/metadata.json"
      )

      //console.log("ClassLabels:", model.getClassLabels())
      //console.log("TotalClasses:", model.getTotalClasses())
      setModel(model)
    }

    loadModel()
  }, [])

  return (
    <div className="flex items-center justify-center bg-cyan-400">
      <div className="p-10 w-full lg:w-[75%] lg:px-0">
        {/* <AllCameras /> */}

        {/* Título general */}
        <div className="px-10 py-5 bg-white rounded-xl">
          <h1 className="text-3xl text-center font-bold">
            Detección de frutas y hortalizas
          </h1>
        </div>

        {/* Paso 1 */}
        <div className="mt-5 p-10 bg-white rounded-xl">
          {/* Título */}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon className="w-5" icon={faCircleCheck} />
            <h2 className="text-xl font-bold underline underline-offset-2">
              Indicaciones:
            </h2>
          </div>

          {/* Descripción */}
          <p className="mt-5 text-pretty">
            Usa la cámara para poder capturar una imagen la cual será usada para
            reconocer la fruta a la cual deseas saber sus características, luego
            pulsa <b className="text-blue-500">Iniciar detección</b> cuando estés de acuerdo con la
            imagen.
            <br />
            <br />
            Por el momento, se le redirigirá a la página de <b>Wikipedia</b> en
            relación a la información de esa fruta puesto que se está trabajando
            aún con la base de datos de las frutas y hortalizas disponibles. En
            la siguiente versión se obtendrá información más detallada y
            verídica de la información de cada fruta y hortaliza en particular
            en esta misma página.
          </p>

          {/* Aplicación */}
          <div className="mt-10 flex items-center justify-center gap-5">
            {/* Video */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon className="w-5" icon={faVideo} />
                <h2 className="text-md font-bold">Cámara</h2>
              </div>
              <Webcam
                className="shadow-lg rounded-xl"
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
                onUserMedia={onUserMedia}
                mirrored={true}
                screenshotQuality={1}
              />
              <div className="flex gap-2">
                <button
                  className="py-2 px-5 flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white shadow-md rounded-lg"
                  onClick={capturePhoto}
                >
                  <FontAwesomeIcon className="w-5" icon={faCameraRetro} />
                  <p className="text-sm font-lg">Tomar foto</p>
                </button>
                <div>
                  <label
                    htmlFor="file-input"
                    className="py-2 px-5 flex items-center gap-2 bg-purple-500 hover:bg-purple-700 text-white shadow-md rounded-lg cursor-pointer"
                  >
                    <FontAwesomeIcon className="w-5" icon={faImage} />
                    <p className="text-sm font-lg">Abrir imagen</p>
                  </label>
                  <input
                    id="file-input"
                    className="hidden"
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={captureImage}
                  />
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon className="w-5" icon={faImage} />
                <h2 className="text-md font-bold">Imagen</h2>
              </div>
              {url ? (
                <div className="bg-gray-100 shadow-lg rounded-xl">
                  <Image
                    className="w-[320px] h-[180px] object-contain rounded-lg"
                    src={url}
                    alt="Screenshot"
                    width={videoConstraints.width}
                    height={videoConstraints.height}
                  />
                </div>
              ) : (
                <div
                  className={`w-[320px] h-[180px] flex items-center justify-center bg-gray-50 border-4 border-blue-500 gap-3 rounded-xl`}
                >
                  <FontAwesomeIcon className="w-5" icon={faEyeSlash} />
                  <p className="text-md text-pretty font-bold">No hay imagen</p>
                </div>
              )}
              <button
                className="py-2 px-5 flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white shadow-md rounded-lg"
                onClick={() => setUrl(null)}
              >
                <FontAwesomeIcon className="w-5" icon={faCameraRotate} />
                <p className="text-sm font-lg">Volver a capturar foto</p>
              </button>
            </div>
          </div>

          {/* Ejecución */}
          <hr className="mt-10 border border-gray-300" />

          <div className="w-full flex justify-end">
            <button
              onClick={prediction}
              className="mt-5 py-2 px-5 flex items-center gap-2 bg-green-500 hover:bg-green-700 text-white shadow-md rounded-lg"
              disabled={url ? false : true}
            >
              <FontAwesomeIcon className="w-5" icon={faCheck} />
              <p className="font-bold">Iniciar detección</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
