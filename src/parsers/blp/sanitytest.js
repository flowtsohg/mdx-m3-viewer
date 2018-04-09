export default function sanityTest(texture) {
    let messages = [];

    let content = texture.content,
        alphaBits = texture.alphaBits,
        width = texture.width,
        height = texture.height,
        mipmapOffsets = texture.mipmapOffsets,
        mipmapSizes = texture.mipmapSizes;

    if (content !== 0 && content !== 1) {
        messages.push('Unknown content type');
    }

    if (alphaBits !== 0 && alphaBits !== 1 && alphaBits !== 4 && alphaBits !== 8) {
        messages.push(`Expected alpha bits to be 0, 1, 4, or 8, but got ${alphaBits}`);
    }

    if (width > 512 || height > 512) {
        messages.push(`Expected width and height up to 512, but got ${width}x${height}`);
    }

    if (content === 0) {
        let jpgHeader = texture.jpgHeader;

        if (jpgHeader.length > 624) {
            messages.push(`Expected the JPG header to be at most 624 bytes, but got ${jpgHeader.length}`);
        }
    }

    for (let i = 0; i < 16; i++) {
        if (mipmapSizes[i] > 0) {
            // This happens if this mipmap level supposedly exists, but we already passed the level that should have been last.
            if (width < 1 || height < 1) {
                messages.push(`Mipmap ${i}: this mipmap should not exist`);
            } else {
                if (content === 0) {
                    try {
                        let imageData = texture.getMipmap(i);

                        if (imageData.width !== width || imageData.height !== height) {
                            messages.push(`Mipmap ${i}: the JPG width (${imageData.width}) and height (${imageData.height}) do not match the mipmap width (${width}) and height (${height})`);
                        }
                    } catch (e) {
                        messages.push(`Mipmap ${i}: JPG decoding failed`)
                    }
                    
                } else if (content === 1) {
                    let pixels = width * height,
                        size = pixels + Math.ceil((pixels * alphaBits) / 8);

                    if (size !== mipmapSizes[i]) {
                        messages.push(`Mipmap ${i}: the declared size is ${mipmapSizes[i]}, but the real size is ${size}`);
                    }
                }
            }
        }

        width = Math.floor(width / 2);
        height = Math.floor(height / 2);
    }

    return messages;
};
