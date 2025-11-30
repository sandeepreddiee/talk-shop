// Audio feedback component for providing sound cues
export const playSuccessSound = () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYKGGe78OahUBAOUKfk7rhjHQU4kdfyz3osBSR3x/DdkUAKFF607u2oVRQLRp/g88NuIQYrgs/y2Ik2ChhouzDppVIQDlCn5O+4Yx0FOJHo8s96LAYkd8jw3ZFAChRhtO7tqFUUC0af4PPCbSEGK4LP8tmJNgoYZ7sw6aVSEA5Qp+TvuGMdBTiR6PLP'); 
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

export const playErrorSound = () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYKGGe78OahUBAOUKfk7rhjHQU4kdfyz3osBSR3x/DdkUAKFF607u2oVRQLRp/g88NuIQYrgs/y2Ik2ChhouzDppVIQDlCn5O+4Yx0FOJHo8s96LAYkd8jw3ZFAChRhtO7tqFUUC0af4PPCbSEGK4LP8tmJNgoYZ7sw6aVSEA5Qp+TvuGMdBTiR6PLP');
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

export const playNavigationSound = () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYKGGe78OahUBAOUKfk7rhjHQU4kdfyz3osBSR3x/DdkUAKFF607u2oVRQLRp/g88NuIQYrgs/y2Ik2ChhouzDppVIQDlCn5O+4Yx0FOJHo8s96LAYkd8jw3ZFAChRhtO7tqFUUC0af4PPCbSEGK4LP8tmJNgoYZ7sw6aVSEA5Qp+TvuGMdBTiR6PLP');
  audio.volume = 0.2;
  audio.play().catch(() => {});
};

export const playClickSound = () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYKGGe78OahUBAOUKfk7rhjHQU4kdfyz3osBSR3x/DdkUAKFF607u2oVRQLRp/g88NuIQYrgs/y2Ik2ChhouzDppVIQDlCn5O+4Yx0FOJHo8s96LAYkd8jw3ZFAChRhtO7tqFUUC0af4PPCbSEGK4LP8tmJNgoYZ7sw6aVSEA5Qp+TvuGMdBTiR6PLP');
  audio.volume = 0.1;
  audio.play().catch(() => {});
};
