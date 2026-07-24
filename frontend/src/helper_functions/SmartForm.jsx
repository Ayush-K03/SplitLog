import { useNavigation, Form } from 'react-router-dom';

export function SmartForm({ children, loadingMessage = "Saving...", ...props }) {
  const navigation = useNavigation();
  const isSaving = navigation.state === "submitting";

  return (
      {!isSaving ? (
        children
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingMessage}</p>
        </div>
      )}
    </Form>
  );
}
