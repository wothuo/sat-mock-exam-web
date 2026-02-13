import { get, post } from '@/utils/request';

/**
 * 获取OSS上传策略
 */
export const getOssPolicy = () => {
  return get('/oss/policy');
};

/**
 * 确认上传（将文件从临时目录移动到正式目录）
 * @param {string} tempUrl 临时文件完整URL
 */
export const confirmOssUpload = (tempUrl) => {
  return post('/oss/confirm', { tempUrl });
};

/**
 * 直接上传文件到OSS
 * @param {File} file 文件对象
 * @returns {Promise<string>} 返回正式文件的URL
 */
export const uploadToOss = async (file) => {
  try {
    // 1. 获取上传策略
    const { data: policy } = await getOssPolicy();
    
    // 2. 准备上传数据
    const formData = new FormData();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`;
    const key = `${policy.dir}${fileName}`;
    
    formData.append('key', key);
    formData.append('policy', policy.policy);
    formData.append('OSSAccessKeyId', policy.accessId);
    formData.append('success_action_status', '200');
    formData.append('signature', policy.signature);
    formData.append('file', file);

    // 3. 上传到OSS (直传)
    const uploadRes = await fetch(policy.host, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error('上传到OSS失败');
    }

    // 4. 获取临时URL并确认上传
    const tempUrl = `${policy.host}/${key}`;
    const { data: finalUrl } = await confirmOssUpload(tempUrl);
    
    return finalUrl;
  } catch (error) {
    console.error('OSS上传失败:', error);
    throw error;
  }
};
