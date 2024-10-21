"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // URL da imagem para exibição
  const [imageBuffer, setImageBuffer] = useState<ArrayBuffer | null>(null); // Buffer da imagem atual ou nova

  // Função para buscar a imagem do servidor e armazenar como buffer
  const fetchImageFromServer = async () => {
    try {
      const response = await fetch("/api/get-image"); // Exemplo de endpoint
      if (!response.ok) {
        throw new Error("Erro ao buscar a imagem");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer(); // Converte a resposta em ArrayBuffer
      setImageBuffer(arrayBuffer); // Armazena o buffer da imagem do servidor

      const imageUrl = URL.createObjectURL(blob); // Cria uma URL para exibição da imagem
      setImageSrc(imageUrl); // Define a URL da imagem para exibição
    } catch (error) {
      alert("Erro ao carregar a imagem do servidor");
    }
  };

  // Função para converter o arquivo de upload em buffer
  const convertFileToBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer); // O resultado será um ArrayBuffer
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  // Função chamada antes do upload da nova imagem
  const handleBeforeUpload = async (file: File) => {
    try {
      const buffer = await convertFileToBuffer(file);
      setImageBuffer(buffer); // Substitui o buffer pela nova imagem
      const imageUrl = URL.createObjectURL(file); // Atualiza a URL da imagem no frontend
      setImageSrc(imageUrl);
      alert("Nova imagem carregada com sucesso!");
    } catch (error) {
      alert("Erro ao carregar a nova imagem");
    }

    // Impede o upload automático, pois vamos controlar o envio manualmente
    return false;
  };

  // Função para enviar a imagem (atual ou nova) para o servidor
  const handleUpload = () => {
    if (imageBuffer) {
      // Exemplo de envio do buffer para o servidor
      console.log("Enviando buffer:", imageBuffer);
      // Exemplo de envio: fetch('/api/upload', { method: 'POST', body: imageBuffer });
      alert("Imagem enviada com sucesso!");
    } else {
      alert("Nenhuma imagem carregada para enviar.");
    }
  };

  // Carrega a imagem do servidor quando o componente for montado
  useEffect(() => {
    fetchImageFromServer();
  }, []);

  return (
    <div>
      <h1>Upload de Imagem</h1>

      {/* Exibe a imagem atual carregada do servidor */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Imagem atual do servidor"
          width={200}
          style={{ marginBottom: 16 }}
        />
      ) : (
        <p>Carregando imagem...</p>
      )}

      {/* Input para carregar uma nova imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={async (event) => {
          if (event.target.files && event.target.files[0]) {
            await handleBeforeUpload(event.target.files[0]);
          }
        }}
        style={{ marginBottom: 16 }}
      />

      {/* Botão para enviar a nova imagem ou a imagem atual */}
      <button
        onClick={handleUpload}
        style={{
          marginTop: 16,
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Enviar Imagem
      </button>
    </div>
  );
}
