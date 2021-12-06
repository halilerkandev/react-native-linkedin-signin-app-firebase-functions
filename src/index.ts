import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  // eslint-disable-next-line max-len
  serviceAccountId: `${functions.config().serviceaccountid.clientid}@${functions.config().serviceaccountid.projectid}.iam.gserviceaccount.com`,
});

export const createUser = functions.https.onCall(
    async ({id, displayName, email, role, photoURL}) => {
      try {
        const user = await admin.auth().createUser({
          uid: id,
          displayName,
          email,
          disabled: false,
          emailVerified: false,
          photoURL,
        });

        await admin.auth().setCustomUserClaims(user.uid, {
          role,
        });

        const token = await admin.auth().createCustomToken(user.uid);

        return {
          success: true,
          data: {
            token,
          },
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }
);

export const deleteUser = functions.https.onCall(
    async ({id}) => {
      try {
        await admin.auth().updateUser(id, {disabled: true});

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }
);

export const getToken = functions.https.onCall(
    async ({id}) => {
      try {
        const token = await admin.auth().createCustomToken(id);

        return {
          success: true,
          data: {
            token,
          },
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    }
);

export const getUser = functions.https.onCall(async ({id}) => {
  try {
    const user = await admin.auth().getUser(id);

    return {
      success: true,
      data: {
        user,
      },
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
});
