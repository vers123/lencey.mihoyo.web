// 账户页面模块

async function loadAccountUserData() {
    await loadUserInfo();
    await loadFavorites();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function bindAccountPageEvents() {
    const editProfileButton = document.getElementById('editProfileButton');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const changeSecurityQuestionButton = document.getElementById('changeSecurityQuestionButton');
    const loginHistoryButton = document.getElementById('loginHistoryButton');
    const closeEditProfileModal = document.getElementById('closeEditProfileModal');
    const cancelEditProfile = document.getElementById('cancelEditProfile');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeChangePasswordModal = document.getElementById('closeChangePasswordModal');
    const cancelChangePassword = document.getElementById('cancelChangePassword');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const closeChangeSecurityQuestionModal = document.getElementById('closeChangeSecurityQuestionModal');
    const cancelChangeSecurityQuestion = document.getElementById('cancelChangeSecurityQuestion');
    const changeSecurityQuestionForm = document.getElementById('changeSecurityQuestionForm');
    const closeLoginHistoryModal = document.getElementById('closeLoginHistoryModal');
    const exportDataButton = document.getElementById('exportDataButton');
    const importDataInput = document.getElementById('importDataInput');

    if (editProfileButton) {
        editProfileButton.addEventListener('click', function() {
            const nickname = document.getElementById('userNickname').textContent;
            document.getElementById('editNickname').value = nickname;
            openModal('editProfileModal');
        });
    }

    if (closeEditProfileModal) {
        closeEditProfileModal.addEventListener('click', () => closeModal('editProfileModal'));
    }
    if (cancelEditProfile) {
        cancelEditProfile.addEventListener('click', () => closeModal('editProfileModal'));
    }
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nickname = document.getElementById('editNickname').value;
            if (!nickname) {
                alert('请输入昵称');
                return;
            }
            const success = await updateUserProfile(nickname);
            if (success) {
                alert('资料修改成功');
                await loadUserInfo();
                closeModal('editProfileModal');
            } else {
                alert('资料修改失败，请重试');
            }
        });
    }

    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', () => openModal('changePasswordModal'));
    }
    if (closeChangePasswordModal) {
        closeChangePasswordModal.addEventListener('click', () => closeModal('changePasswordModal'));
    }
    if (cancelChangePassword) {
        cancelChangePassword.addEventListener('click', () => closeModal('changePasswordModal'));
    }
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const result = await changePassword(currentPassword, newPassword, confirmNewPassword);
            if (result.success) {
                alert(result.message);
                closeModal('changePasswordModal');
            } else {
                alert(result.message);
            }
        });
    }

    if (changeSecurityQuestionButton) {
        changeSecurityQuestionButton.addEventListener('click', function() {
            const userId = document.getElementById('userId').textContent;
            document.getElementById('accountId').value = userId;
            openModal('changeSecurityQuestionModal');
        });
    }
    if (closeChangeSecurityQuestionModal) {
        closeChangeSecurityQuestionModal.addEventListener('click', () => closeModal('changeSecurityQuestionModal'));
    }
    if (cancelChangeSecurityQuestion) {
        cancelChangeSecurityQuestion.addEventListener('click', () => closeModal('changeSecurityQuestionModal'));
    }
    if (changeSecurityQuestionForm) {
        changeSecurityQuestionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const userId = document.getElementById('accountId').value;
            const securityQuestion = document.getElementById('newSecurityQuestion').value;
            const securityAnswer = document.getElementById('newSecurityAnswer').value;
            const confirmAnswer = document.getElementById('confirmSecurityAnswer').value;
            const result = await changeSecurityQuestion(userId, securityQuestion, securityAnswer, confirmAnswer);
            if (result.success) {
                alert(result.message);
                closeModal('changeSecurityQuestionModal');
            } else {
                alert(result.message);
            }
        });
    }

    if (loginHistoryButton) {
        loginHistoryButton.addEventListener('click', function() {
            loadLoginHistory();
            openModal('loginHistoryModal');
        });
    }
    if (closeLoginHistoryModal) {
        closeLoginHistoryModal.addEventListener('click', () => closeModal('loginHistoryModal'));
    }
    if (exportDataButton) {
        exportDataButton.addEventListener('click', function() {
            exportUserData();
        });
    }
    if (importDataInput) {
        importDataInput.addEventListener('change', function(event) {
            importUserData(event);
        });
    }
}

function loadLoginHistory() {
    const userId = getCurrentUser();
    if (!userId) return;

    const loginHistory = getLoginHistory(userId);
    const loginHistoryList = document.getElementById('loginHistoryList');
    if (!loginHistoryList) return;

    if (loginHistory.length === 0) {
        loginHistoryList.innerHTML = `
            <div class="text-gray-500 dark:text-gray-400 text-center py-8">
                <span class="lang-zh">暂无登录历史</span>
                <span class="lang-en hidden">No login history</span>
            </div>
        `;
        return;
    }

    const historyHTML = loginHistory.map(item => `
        <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth mb-2">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-medium text-gray-800 dark:text-white">${item.ip}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                    ${item.userAgent.substring(0, 50)}${item.userAgent.length > 50 ? '...' : ''}
                </div>
            </div>
        </div>
    `).join('');

    loginHistoryList.innerHTML = historyHTML;
}

async function initAccountPage() {
    initPage();

    if (!checkLoginStatus()) {
        window.location.href = '../auth/login.html';
        return;
    }

    await loadAccountUserData();
    bindAccountPageEvents();
}

window.initAccountPage = initAccountPage;
window.loadLoginHistory = loadLoginHistory;
