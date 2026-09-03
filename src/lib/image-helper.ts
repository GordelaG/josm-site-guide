/**
 * Utilitário para processamento e compressão de imagens no cliente (Prints do EuroScope / JOSM).
 * Redimensiona para limites ideais (ex: max 1600px) e comprime como JPEG/WebP para armazenamento eficiente.
 */
export async function processImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validação básica de tipo
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Desenha a imagem otimizada
        ctx.drawImage(img, 0, 0, width, height);

        // Exporta como image/jpeg ou image/webp de alta qualidade
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error('Erro ao decodificar a imagem selecionada.'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo de imagem.'));
    };

    reader.readAsDataURL(file);
  });
}
