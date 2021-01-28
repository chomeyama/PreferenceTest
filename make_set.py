import os
import shutil

for x in range(5):
    with open(f'set{x+1}.lst', mode='w') as f:
        for i in range(3):
            os.makedirs(f'wav/set{x+1}/method{i+1}', exist_ok=True)
            for j, scale in enumerate(['normal', 'scale2', 'scale0.5']):
                for k, spk in enumerate(['slt', 'bdl', 'clb', 'rms']):
                    if scale == 'normal':
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}.wav'
                    elif scale == 'scale2':
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}_x2.wav'
                    else:
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}_x0.5.wav'
                    f.write(file_path + '\n')
                    new_file_path = shutil.move(file_path, f'wav/set{x+1}/method{i+1}/')
                    # print(file_path, new_file_path)

for x in range(5):
    with open(f'set{x+6}.lst', mode='w') as f:
        for i in range(3):
            os.makedirs(f'wav/set{x+6}/method{i+1}', exist_ok=True)
            for j, scale in enumerate(['scale0.5', 'normal', 'scale2']):
                for k, spk in enumerate(['slt', 'bdl', 'clb', 'rms']):
                    if scale == 'scale0.5':
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}_x0.5.wav'
                    elif scale == 'normal':
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}.wav'
                    else:
                        file_path = f'method{i+1}/{scale}/{spk}_arctic_b{x*12+j*4+k+474:0>4}_x2.wav'
                    f.write(file_path + '\n')
                    new_file_path = shutil.move(file_path, f'wav/set{x+6}/method{i+1}/')
                    # print(file_path, new_file_path)