import { useNavigation, Form } from 'react-router-dom';

export function SmartForm({ children, loadingMessage = "Saving...", ...props }) {
  const navigation = useNavigation();
   const isSaving = isLoading || navigation.state === "submitting";

  return (
    <Form {...props}>
      {isSaving ?  (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{loadingMessage}</p>
        </div>
      ) : (
        children
      )}
    </Form>
  );
}
